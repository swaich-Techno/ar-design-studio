import type { CameraFacing } from "../types";

export type CameraStartResult =
  | { ok: true; stream: MediaStream; facingMode: CameraFacing }
  | { ok: false; reason: "denied" | "unavailable" | "insecure" | "error"; message: string };

function facingSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

export class CameraManager {
  video: HTMLVideoElement | null = null;
  stream: MediaStream | null = null;
  facingMode: CameraFacing = "user";
  private starting: Promise<CameraStartResult> | null = null;

  attach(video: HTMLVideoElement) {
    this.video = video;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
  }

  async start(facing: CameraFacing = "user"): Promise<CameraStartResult> {
    if (this.starting) return this.starting;
    this.starting = this.startInner(facing).finally(() => {
      this.starting = null;
    });
    return this.starting;
  }

  private async startInner(facing: CameraFacing): Promise<CameraStartResult> {
    if (typeof window === "undefined") {
      return { ok: false, reason: "unavailable", message: "Camera is only available in the browser." };
    }
    if (!window.isSecureContext) {
      return {
        ok: false,
        reason: "insecure",
        message: "Camera needs HTTPS (or localhost). Open this page on your phone via ar.bsocio.in.",
      };
    }
    if (!facingSupported()) {
      return { ok: false, reason: "unavailable", message: "This browser cannot open a camera." };
    }

    this.stopTracks();
    const constraints: MediaStreamConstraints[] = [
      {
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
        },
      },
      { audio: false, video: { facingMode: facing } },
      { audio: false, video: true },
    ];

    let lastError: unknown;
    for (const constraint of constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        this.stream = stream;
        this.facingMode = facing;
        if (this.video) {
          this.video.srcObject = stream;
          await this.video.play().catch(() => undefined);
        }
        return { ok: true, stream, facingMode: facing };
      } catch (error) {
        lastError = error;
      }
    }

    const err = lastError as { name?: string; message?: string } | undefined;
    if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
      return {
        ok: false,
        reason: "denied",
        message: "Camera permission was blocked. Allow the camera to try jewellery on with your live video.",
      };
    }
    if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
      return { ok: false, reason: "unavailable", message: "No usable camera was found on this device." };
    }
    return {
      ok: false,
      reason: "error",
      message: err?.message || "The camera could not start. You can still view the piece in 3D.",
    };
  }

  async flip(): Promise<CameraStartResult> {
    const next: CameraFacing = this.facingMode === "user" ? "environment" : "user";
    return this.start(next);
  }

  canFlip() {
    return this.facingMode === "user" || this.facingMode === "environment";
  }

  ready() {
    const video = this.video;
    return Boolean(video && video.readyState >= 2 && video.videoWidth > 0);
  }

  private stopTracks() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    if (this.video) this.video.srcObject = null;
  }

  stop() {
    this.stopTracks();
  }
}
