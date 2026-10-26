import { CameraManager, type CameraStartResult } from "./camera/CameraManager";
import { TrackingManager } from "./tracking/TrackingManager";
import { getAnchor } from "./anchors";
import { TryOnRenderer } from "./rendering/TryOnRenderer";
import { resolveCalibration } from "./calibration";
import { EarPairSmoother, SingleAnchorSmoother, lerp } from "./utils/smoothing";
import { coverDrawSource, coverMap } from "./utils/transforms";
import { TrackVisibility } from "./utils/visibility";
import { trackersFor } from "./types";
import type {
  AnchorType,
  CameraFacing,
  DebugMode,
  OverlayAnchor,
  ResolvedCalibration,
  TrackerStatus,
  TryOnProduct,
  ViewportMap,
} from "./types";
import { resolveTryOnAsset } from "./catalog";

export type EngineSnapshot = {
  faceDetected: boolean;
  bodyDetected: boolean;
  fps: number;
  trackingFps: number;
  facingMode: CameraFacing;
  trackerStatus: TrackerStatus | string;
  trackerError: string | null;
  hint: string | null;
  cameraRunning: boolean;
  trackerRunning: boolean;
  hasLandmarks: boolean;
  confidence: number;
  anchor: OverlayAnchor | null;
  missingAsset: boolean;
  assetKind: "glb" | "image" | "missing";
  assetUrl: string;
  productType: string;
  occlusionActive: boolean;
  scaleValid: boolean;
};

function honestHint(product: TryOnProduct, status: TrackerStatus | string, detected: boolean): string | null {
  if (status === "loading") {
    if (product.anchorType === "finger") return "Loading ring tracker… earrings are not used.";
    if (product.anchorType === "neck") return "Loading necklace tracker… earrings are not used.";
    return "Loading tracker…";
  }
  if (status === "error" || status === "unsupported") {
    if (product.anchorType === "finger") {
      return "Ring tracking could not start on this device. Camera stays live — hoop earrings are not loaded.";
    }
    if (product.anchorType === "neck") {
      return "Necklace tracking could not start on this device. Camera stays live — earrings are not loaded.";
    }
    return "Tracker could not start. Camera stays live.";
  }
  if (!detected) {
    if (product.anchorType === "finger") return "Hold up your hand — ring finger toward the camera";
    if (product.anchorType === "neck") return "Frame your neck and shoulders";
    return "Look at the camera";
  }
  return null;
}

export class TryOnEngine {
  camera = new CameraManager();
  tracking = new TrackingManager();
  renderer = new TryOnRenderer();
  product: TryOnProduct | null = null;
  calibration: ResolvedCalibration | null = null;
  mirrored = true;
  faceDetected = false;
  bodyDetected = false;
  fps = 0;
  private earSmoother = new EarPairSmoother();
  private singleSmoother = new SingleAnchorSmoother();
  private smoothed: OverlayAnchor | null = null;
  private visibility = new TrackVisibility();
  private running = false;
  private raf = 0;
  private lastFrame = 0;
  private fpsFrames = 0;
  private fpsStamp = 0;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  debugMode: DebugMode = "off";
  private trackingFps = 0;
  private detectFrames = 0;
  private detectStamp = 0;

  async attach(opts: {
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    product: TryOnProduct;
    facing?: CameraFacing;
  }): Promise<CameraStartResult> {
    this.video = opts.video;
    this.canvas = opts.canvas;
    this.product = opts.product;
    this.calibration = resolveCalibration(opts.product);
    this.camera.attach(opts.video);
    this.renderer.attach(opts.canvas);
    this.renderer.debugMode = this.debugMode;
    await this.renderer.setProduct(opts.product);
    const started = await this.camera.start(opts.facing ?? "user");
    if (!started.ok) return started;
    this.mirrored = this.camera.facingMode === "user";
    await this.tracking.ensure(opts.product.anchorType);
    this.startLoop();
    return started;
  }

  async setProduct(product: TryOnProduct) {
    const prevAnchor = this.product?.anchorType;
    this.product = product;
    this.calibration = resolveCalibration(product);
    this.earSmoother.reset();
    this.singleSmoother.reset();
    this.smoothed = null;
    this.visibility.reset();
    this.faceDetected = false;
    this.bodyDetected = false;
    this.renderer.debugMode = this.debugMode;
    await this.renderer.setProduct(product);
    if (prevAnchor !== product.anchorType) {
      await this.tracking.ensure(product.anchorType);
    }
  }

  setCalibration(calibration: ResolvedCalibration) {
    this.calibration = calibration;
  }

  resetAlignment() {
    this.earSmoother.reset();
    this.singleSmoother.reset();
    this.smoothed = null;
    this.visibility.reset();
    if (this.product) this.calibration = resolveCalibration(this.product, {});
  }

  async flipCamera() {
    const result = await this.camera.flip();
    if (result.ok) this.mirrored = result.facingMode === "user";
    this.earSmoother.reset();
    this.singleSmoother.reset();
    this.visibility.reset();
    return result;
  }

  async screenshot(): Promise<string | null> {
    const video = this.video;
    const canvas = this.canvas;
    if (!video || !canvas || video.readyState < 2) return null;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(w * 2));
    out.height = Math.max(1, Math.round(h * 2));
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    const src = coverDrawSource(video.videoWidth, video.videoHeight, out.width, out.height);
    ctx.save();
    if (this.mirrored) {
      ctx.translate(out.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, src.sx, src.sy, src.sw, src.sh, 0, 0, out.width, out.height);
    ctx.restore();
    ctx.drawImage(canvas, 0, 0, out.width, out.height);
    return out.toDataURL("image/png");
  }

  setDebugMode(mode: DebugMode) {
    this.debugMode = mode;
    this.renderer.debugMode = mode;
  }

  snapshot(): EngineSnapshot {
    const product = this.product;
    const anchorType: AnchorType = product?.anchorType ?? "ears";
    const status = this.tracking.statusFor(anchorType);
    const detected = product?.anchorType === "finger" ? this.bodyDetected : this.faceDetected || this.bodyDetected;
    const asset = product ? resolveTryOnAsset(product) : { kind: "missing" as const, url: "" };
    const ppm = this.smoothed?.pixelsPerMm ?? 0;
    return {
      faceDetected: this.faceDetected,
      bodyDetected: this.bodyDetected,
      fps: this.fps,
      trackingFps: this.trackingFps,
      facingMode: this.camera.facingMode,
      trackerStatus: status,
      trackerError: this.tracking.errorFor(anchorType),
      hint: product ? honestHint(product, status, detected) : null,
      cameraRunning: this.camera.ready(),
      trackerRunning: status === "ready",
      hasLandmarks: Boolean(this.smoothed?.debug?.length || this.tracking.lastSnapshot.hand || this.tracking.lastSnapshot.pose || this.tracking.lastSnapshot.face),
      confidence: this.smoothed?.confidence ?? 0,
      anchor: this.smoothed,
      missingAsset: this.renderer.missingAsset || asset.kind === "missing",
      assetKind: this.renderer.assetKind || asset.kind,
      assetUrl: this.renderer.assetUrl || asset.url,
      productType: product?.category ?? "unknown",
      occlusionActive: Boolean(this.smoothed?.occluder) || Boolean(product && product.anchorType === "neck"),
      scaleValid: ppm > 0.0002 && ppm < 0.02,
    };
  }

  private viewport(): ViewportMap | null {
    const video = this.video;
    const canvas = this.canvas;
    if (!video || !canvas || !video.videoWidth) return null;
    return coverMap(video.videoWidth, video.videoHeight, canvas.clientWidth, canvas.clientHeight, this.mirrored);
  }

  private startLoop() {
    if (this.running) return;
    this.running = true;
    const tick = (time: number) => {
      if (!this.running) return;
      this.step(time);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private step(time: number) {
    const dt = this.lastFrame ? (time - this.lastFrame) / 1000 : 0.016;
    this.lastFrame = time;
    this.fpsFrames += 1;
    if (time - this.fpsStamp > 500) {
      this.fps = Math.round((this.fpsFrames * 1000) / (time - this.fpsStamp));
      this.fpsFrames = 0;
      this.fpsStamp = time;
    }

    const video = this.video;
    const product = this.product;
    const calibration = this.calibration;
    const viewport = this.viewport();
    if (!video || !product || !calibration || !viewport || !this.camera.ready()) {
      return;
    }

    this.renderer.resize(viewport.vfovDeg);
    this.renderer.matchVideoLuma(video);
    const map = this.viewport();
    if (!map) return;

    const need = trackersFor(product.anchorType);
    const prevTs = Math.max(
      this.tracking.lastSnapshot.face?.timestamp ?? 0,
      this.tracking.lastSnapshot.hand?.timestamp ?? 0,
      this.tracking.lastSnapshot.pose?.timestamp ?? 0,
    );
    const tracking = this.tracking.update(video, time, this.mirrored, need);
    const nextTs = Math.max(
      tracking.face?.timestamp ?? 0,
      tracking.hand?.timestamp ?? 0,
      tracking.pose?.timestamp ?? 0,
    );
    if (nextTs > prevTs) this.detectFrames += 1;
    if (time - this.detectStamp > 500) {
      this.trackingFps = Math.round((this.detectFrames * 1000) / Math.max(time - this.detectStamp, 1));
      this.detectFrames = 0;
      this.detectStamp = time;
    }
    this.faceDetected = Boolean(tracking.face);
    this.bodyDetected = product.anchorType === "finger" ? Boolean(tracking.hand) : Boolean(tracking.pose || tracking.face);

    const status = this.tracking.statusFor(product.anchorType);
    if (status === "loading" || status === "error" || status === "unsupported") {
      this.smoothed = null;
      this.visibility.reset();
      this.renderer.render(tracking, null, map, product, calibration, 0, dt);
      return;
    }

    const anchorImpl = getAnchor(product.category);
    if (!anchorImpl || !anchorImpl.implemented) {
      this.smoothed = null;
      this.renderer.render(tracking, null, map, product, calibration, 0, dt);
      return;
    }

    const raw = anchorImpl.compute(tracking, product, calibration, map);
    const detected = Boolean(raw);
    const opacity = this.visibility.update(detected, time);
    if (raw) {
      this.smoothed = raw.mode === "pair" ? this.smoothPair(raw, time, dt) : this.smoothSingle(raw, time, dt);
    } else if (opacity <= 0) {
      this.smoothed = null;
    }
    this.renderer.render(tracking, this.smoothed, map, product, calibration, opacity, dt);
  }

  private smoothPair(raw: OverlayAnchor, time: number, dt: number): OverlayAnchor {
    const s = this.earSmoother;
    const t = Math.min(1, dt / 0.045);
    const left = {
      x: s.left.x.filter(raw.left.x, time),
      y: s.left.y.filter(raw.left.y, time),
      z: s.left.z.filter(raw.left.z, time),
    };
    const right = {
      x: s.right.x.filter(raw.right.x, time),
      y: s.right.y.filter(raw.right.y, time),
      z: s.right.z.filter(raw.right.z, time),
    };
    const pose = {
      yaw: s.pose.yaw.filter(raw.pose.yaw, time),
      pitch: s.pose.pitch.filter(raw.pose.pitch, time),
      roll: s.pose.roll.filter(raw.pose.roll, time),
      scale: s.pose.scale.filter(raw.pose.scale, time),
    };
    if (this.smoothed?.mode === "pair") {
      left.x = lerp(this.smoothed.left.x, left.x, t);
      left.y = lerp(this.smoothed.left.y, left.y, t);
      left.z = lerp(this.smoothed.left.z, left.z, t);
      right.x = lerp(this.smoothed.right.x, right.x, t);
      right.y = lerp(this.smoothed.right.y, right.y, t);
      right.z = lerp(this.smoothed.right.z, right.z, t);
    }
    return {
      ...raw,
      left,
      right,
      point: { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2, z: (left.z + right.z) / 2 },
      pose,
      pixelsPerMm: s.pixels.filter(raw.pixelsPerMm, time),
    };
  }

  private smoothSingle(raw: OverlayAnchor, time: number, dt: number): OverlayAnchor {
    const s = this.singleSmoother;
    const t = Math.min(1, dt / 0.05);
    let point = {
      x: s.point.x.filter(raw.point.x, time),
      y: s.point.y.filter(raw.point.y, time),
      z: s.point.z.filter(raw.point.z, time),
    };
    if (this.smoothed?.mode === "single") {
      point = {
        x: lerp(this.smoothed.point.x, point.x, t),
        y: lerp(this.smoothed.point.y, point.y, t),
        z: lerp(this.smoothed.point.z, point.z, t),
      };
    }
    const pose = {
      yaw: s.pose.yaw.filter(raw.pose.yaw, time),
      pitch: s.pose.pitch.filter(raw.pose.pitch, time),
      roll: s.pose.roll.filter(raw.pose.roll, time),
      scale: s.pose.scale.filter(raw.pose.scale, time),
    };
    let basis = raw.basis;
    if (raw.basis) {
      const x = {
        x: s.bx.x.filter(raw.basis.x.x, time),
        y: s.bx.y.filter(raw.basis.x.y, time),
        z: s.bx.z.filter(raw.basis.x.z, time),
      };
      const y = {
        x: s.by.x.filter(raw.basis.y.x, time),
        y: s.by.y.filter(raw.basis.y.y, time),
        z: s.by.z.filter(raw.basis.y.z, time),
      };
      const z = {
        x: s.bz.x.filter(raw.basis.z.x, time),
        y: s.bz.y.filter(raw.basis.z.y, time),
        z: s.bz.z.filter(raw.basis.z.z, time),
      };
      basis = { x, y, z };
    }
    let chain = raw.chain;
    if (raw.chain && this.smoothed?.chain) {
      chain = {
        left: {
          x: lerp(this.smoothed.chain.left.x, raw.chain.left.x, t),
          y: lerp(this.smoothed.chain.left.y, raw.chain.left.y, t),
          z: lerp(this.smoothed.chain.left.z, raw.chain.left.z, t),
        },
        pendant: point,
        right: {
          x: lerp(this.smoothed.chain.right.x, raw.chain.right.x, t),
          y: lerp(this.smoothed.chain.right.y, raw.chain.right.y, t),
          z: lerp(this.smoothed.chain.right.z, raw.chain.right.z, t),
        },
      };
    } else if (raw.chain) {
      chain = { left: raw.chain.left, pendant: point, right: raw.chain.right };
    }
    return {
      ...raw,
      left: chain?.left ?? point,
      right: chain?.right ?? point,
      point,
      pose,
      basis,
      chain,
      pixelsPerMm: s.pixels.filter(raw.pixelsPerMm, time),
      confidence: raw.confidence,
      debug: raw.debug,
    };
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.camera.stop();
    this.tracking.dispose();
    this.renderer.dispose();
    this.earSmoother.reset();
    this.singleSmoother.reset();
    this.visibility.reset();
  }
}
