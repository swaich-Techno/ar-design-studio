import * as THREE from "three";
import type {
  DebugMode,
  OverlayAnchor,
  ResolvedCalibration,
  TrackingSnapshot,
  TryOnProduct,
  ViewportMap,
} from "../types";
import { resolveTryOnAsset } from "../catalog";
import { isDropEarring } from "../catalog";
import { MM } from "../utils/cameraSpace";
import { degToRad } from "../utils/transforms";
import { JewelleryFactory } from "./JewelleryFactory";
import { LightingManager } from "./LightingManager";
import { ModelLoader } from "./ModelLoader";
import { OcclusionManager } from "./OcclusionManager";

function adaptiveDpr() {
  if (typeof window === "undefined") return 1;
  const raw = window.devicePixelRatio || 1;
  const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  return Math.min(raw, mobile ? 1.25 : 1.6);
}

const _quat = new THREE.Quaternion();
const _quatB = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _mat = new THREE.Matrix4();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();

const _pos = new THREE.Vector3();

export class TryOnRenderer {
  renderer: THREE.WebGLRenderer | null = null;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(58, 1, 0.05, 6);
  loader = new ModelLoader();
  factory = new JewelleryFactory(this.loader);
  lighting = new LightingManager();
  occluder = new OcclusionManager();
  leftGroup = new THREE.Group();
  rightGroup = new THREE.Group();
  singleGroup = new THREE.Group();
  fingerOccluder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 1, 14),
    new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
    }),
  );
  private canvas: HTMLCanvasElement | null = null;
  private leftModel: THREE.Object3D | null = null;
  private rightModel: THREE.Object3D | null = null;
  private singleModel: THREE.Object3D | null = null;
  private product: TryOnProduct | null = null;
  private loadToken = 0;
  private swingL = { x: 0, z: 0, px: 0, py: 0 };
  private swingR = { x: 0, z: 0, px: 0, py: 0 };
  private lumaCanvas: HTMLCanvasElement | null = null;
  private lumaTick = 0;
  private singlePrimed = false;
  missingAsset = false;
  assetKind: "glb" | "image" | "missing" = "missing";
  assetUrl = "";
  debugMode: DebugMode = "off";
  private debugDots: THREE.InstancedMesh | null = null;

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(adaptiveDpr());
    renderer.autoClear = true;
    this.renderer = renderer;
    this.lighting.apply(this.scene, renderer);
    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(0, 0, 0);
    this.leftGroup.renderOrder = 2;
    this.rightGroup.renderOrder = 2;
    this.singleGroup.renderOrder = 2;
    this.fingerOccluder.geometry.rotateX(Math.PI / 2);
    this.fingerOccluder.renderOrder = 1;
    this.fingerOccluder.visible = false;
    this.fingerOccluder.frustumCulled = false;
    const dotMat = new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false, toneMapped: false });
    this.debugDots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0034, 10, 8), dotMat, 24);
    this.debugDots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.debugDots.frustumCulled = false;
    this.debugDots.renderOrder = 20;
    this.debugDots.visible = false;
    this.scene.add(this.occluder.group, this.leftGroup, this.rightGroup, this.singleGroup, this.fingerOccluder, this.debugDots);
    this.resize(58);
  }

  resize(vfovDeg = 58) {
    if (!this.canvas || !this.renderer) return;
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    this.renderer.setPixelRatio(adaptiveDpr());
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = vfovDeg;
    this.camera.near = 0.05;
    this.camera.far = 6;
    this.camera.updateProjectionMatrix();
  }

  matchVideoLuma(video: HTMLVideoElement | null) {
    if (!this.renderer || !video || video.readyState < 2) return;
    this.lumaTick += 1;
    if (this.lumaTick % 12 !== 0) return;
    if (!this.lumaCanvas) this.lumaCanvas = document.createElement("canvas");
    const c = this.lumaCanvas;
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, 32, 32);
    const data = ctx.getImageData(0, 0, 32, 32).data;
    let acc = 0;
    for (let i = 0; i < data.length; i += 4) {
      acc += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    }
    this.lighting.setExposure(this.renderer, acc / 1024);
  }

  async setProduct(product: TryOnProduct) {
    this.product = product;
    const token = ++this.loadToken;
    this.clearModels();
    this.leftGroup.visible = false;
    this.rightGroup.visible = false;
    this.singleGroup.visible = false;
    this.singleGroup.position.set(0, 0, 0);
    this.singleGroup.quaternion.identity();
    this.singleGroup.scale.setScalar(1);
    this.fingerOccluder.visible = false;
    this.swingL = { x: 0, z: 0, px: 0, py: 0 };
    this.swingR = { x: 0, z: 0, px: 0, py: 0 };
    this.singlePrimed = false;

    const asset = resolveTryOnAsset(product);
    this.assetKind = asset.kind;
    this.assetUrl = asset.url;
    this.missingAsset = asset.kind === "missing";
    if (this.missingAsset) return;

    try {
      if (product.anchorType === "ears") {
        const left = await this.factory.create(product);
        if (token !== this.loadToken) return;
        if (left.userData.missingAsset) {
          this.missingAsset = true;
          return;
        }
        const rightUrl = product.tryOnModelUrl || product.modelUrl;
        const right = left.clone(true);
        if (token !== this.loadToken) return;
        this.preparePair(left, right);
        void rightUrl;
        return;
      }
      const model = await this.factory.create(product);
      if (token !== this.loadToken) return;
      if (model.userData.missingAsset) {
        this.missingAsset = true;
        this.assetKind = "missing";
        return;
      }
      this.singleModel = model;
      this.singleGroup.add(model);
      this.assetKind = (model.userData.assetKind as typeof this.assetKind) || asset.kind;
      this.assetUrl = (model.userData.assetUrl as string) || asset.url;
    } catch {
      if (token !== this.loadToken) return;
      this.missingAsset = true;
      this.assetKind = "missing";
      this.assetUrl = "";
    }
  }

  private preparePair(left: THREE.Object3D, right: THREE.Object3D) {
    right.scale.x *= -1;
    this.leftModel = left;
    this.rightModel = right;
    this.leftGroup.add(left);
    this.rightGroup.add(right);
    this.leftGroup.visible = false;
    this.rightGroup.visible = false;
  }

  private clearModels() {
    if (this.leftModel) this.leftGroup.remove(this.leftModel);
    if (this.rightModel) this.rightGroup.remove(this.rightModel);
    if (this.singleModel) this.singleGroup.remove(this.singleModel);
    this.leftModel = null;
    this.rightModel = null;
    this.singleModel = null;
  }

  private targetQuat(anchor: OverlayAnchor, cal: ResolvedCalibration, side: 1 | -1 | 0) {
    if (anchor.quaternion) {
      _quat.set(anchor.quaternion.x, anchor.quaternion.y, anchor.quaternion.z, anchor.quaternion.w);
    } else if (anchor.basis) {
      _x.set(anchor.basis.x.x, anchor.basis.x.y, anchor.basis.x.z);
      _y.set(anchor.basis.y.x, anchor.basis.y.y, anchor.basis.y.z);
      _z.set(anchor.basis.z.x, anchor.basis.z.y, anchor.basis.z.z);
      _mat.makeBasis(_x, _y, _z);
      _quat.setFromRotationMatrix(_mat);
    } else {
      _euler.set(anchor.pose.pitch, anchor.pose.yaw, anchor.pose.roll, "YXZ");
      _quat.setFromEuler(_euler);
    }
    _euler.set(degToRad(cal.rotationOffset.x), degToRad(cal.rotationOffset.y) * (side || 1), degToRad(cal.rotationOffset.z) * (side || 1));
    _quatB.setFromEuler(_euler);
    _quat.multiply(_quatB);
    return _quat;
  }

  private placePair(
    group: THREE.Group,
    point: OverlayAnchor["left"],
    product: TryOnProduct,
    cal: ResolvedCalibration,
    anchor: OverlayAnchor,
    side: 1 | -1,
    dt: number,
    swing: { x: number; z: number; px: number; py: number },
  ) {
    const worldScale = Math.max(anchor.pixelsPerMm * cal.scaleMultiplier, MM * 0.5);
    group.position.set(point.x, point.y, point.z);
    group.scale.setScalar(worldScale);
    const drop = isDropEarring(product);
    if (drop) {
      const vx = point.x - swing.px;
      const vy = point.y - swing.py;
      swing.px = point.x;
      swing.py = point.y;
      swing.x += vx * 18;
      swing.z += vy * 12;
      swing.x *= 0.86;
      swing.z *= 0.86;
      swing.x = Math.max(-0.28, Math.min(0.28, swing.x));
      swing.z = Math.max(-0.18, Math.min(0.18, swing.z));
      group.quaternion.identity();
      group.rotateZ(anchor.pose.roll * 0.28 + swing.x * side);
      group.rotateX(anchor.pose.pitch * 0.15 + swing.z);
    } else {
      this.targetQuat(anchor, cal, side);
      group.quaternion.slerp(_quat, Math.min(1, dt / 0.07));
    }
  }

  private placeSingle(anchor: OverlayAnchor, product: TryOnProduct, cal: ResolvedCalibration, dt: number) {
    if (this.singleModel?.userData?.layout) {
      this.singleModel.userData.layout(anchor);
      this.fingerOccluder.visible = false;
      return;
    }
    const worldScale = Math.max(anchor.pixelsPerMm * cal.scaleMultiplier, MM * 0.5);
    const targetScale = worldScale;
    const first = !this.singlePrimed;
    _pos.set(anchor.point.x, anchor.point.y, anchor.point.z);
    this.targetQuat(anchor, cal, 0);
    if (first) {
      this.singleGroup.position.copy(_pos);
      this.singleGroup.scale.setScalar(targetScale);
      this.singleGroup.quaternion.copy(_quat);
      this.singlePrimed = true;
    } else {
      this.singleGroup.position.lerp(_pos, Math.min(1, dt / 0.05));
      this.singleGroup.scale.setScalar(
        THREE.MathUtils.lerp(this.singleGroup.scale.x, targetScale, Math.min(1, dt / 0.08)),
      );
      this.singleGroup.quaternion.slerp(_quat, Math.min(1, dt / 0.06));
    }

    const occ = anchor.occluder;
    if (occ && product.anchorType === "finger") {
      this.fingerOccluder.visible = this.debugMode !== "anchors";
      this.fingerOccluder.position.set(occ.origin.x, occ.origin.y, occ.origin.z);
      const r = occ.radiusMm * MM;
      this.fingerOccluder.scale.set(r, r, Math.max(occ.lengthMm * MM, 0.012));
      _z.set(occ.axis.x, occ.axis.y, occ.axis.z);
      if (_z.lengthSq() > 1e-8) {
        _z.normalize();
        this.fingerOccluder.quaternion.setFromUnitVectors(_y.set(0, 0, 1), _z);
      }
    } else {
      this.fingerOccluder.visible = false;
    }
  }

  private updateDebugDots(anchor: OverlayAnchor | null) {
    const mesh = this.debugDots;
    if (!mesh) return;
    const show = this.debugMode !== "off" && Boolean(anchor?.debug?.length);
    mesh.visible = show;
    if (!show || !anchor?.debug) return;
    const dummy = new THREE.Object3D();
    const n = Math.min(anchor.debug.length, mesh.count);
    for (let i = 0; i < mesh.count; i += 1) {
      if (i < n) {
        const p = anchor.debug[i].point;
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(1);
      } else {
        dummy.position.set(0, 0, 10);
        dummy.scale.setScalar(0.001);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  render(
    tracking: TrackingSnapshot,
    anchor: OverlayAnchor | null,
    viewport: ViewportMap,
    product: TryOnProduct | null,
    calibration: ResolvedCalibration,
    opacity = 1,
    dt = 0.016,
  ) {
    if (!this.renderer) return;
    this.resize(viewport.vfovDeg);
    const ears = product?.anchorType === "ears";
    const neck = product?.anchorType === "neck";
    this.occluder.group.visible = Boolean((ears || neck) && (tracking.face || tracking.pose));
    if (ears || neck) this.occluder.update(tracking.face, tracking.pose, viewport, neck ? anchor?.point ?? null : null);

    const hideJewel = this.debugMode === "anchors" || this.missingAsset;
    const show = Boolean(anchor?.visible && product && opacity > 0.02 && !hideJewel);
    this.leftGroup.visible = Boolean(show && ears);
    this.rightGroup.visible = Boolean(show && ears);
    this.singleGroup.visible = Boolean(show && !ears);
    this.updateDebugDots(anchor);
    if (!show) {
      if (this.debugMode === "off") this.fingerOccluder.visible = false;
      this.renderer.render(this.scene, this.camera);
      return;
    }
    if (ears && anchor && product) {
      this.placePair(this.leftGroup, anchor.left, product, calibration, anchor, -1, dt, this.swingL);
      this.placePair(this.rightGroup, anchor.right, product, calibration, anchor, 1, dt, this.swingR);
      JewelleryFactory.setOpacity(this.leftGroup, opacity);
      JewelleryFactory.setOpacity(this.rightGroup, opacity);
      this.fingerOccluder.visible = false;
    } else if (anchor && product) {
      this.placeSingle(anchor, product, calibration, dt);
      JewelleryFactory.setOpacity(this.singleGroup, opacity);
    }
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.clearModels();
    this.occluder.dispose();
    this.lighting.dispose();
    this.fingerOccluder.geometry.dispose();
    (this.fingerOccluder.material as THREE.Material).dispose();
    if (this.debugDots) {
      this.debugDots.geometry.dispose();
      (this.debugDots.material as THREE.Material).dispose();
    }
    this.renderer?.dispose();
    this.renderer = null;
  }
}
