import type { PoseFrame, TrackerStatus } from "../types";

const LOCAL_WASM = "/mediapipe/wasm";
const LOCAL_MODEL = "/mediapipe/pose_landmarker_lite.task";
const CDN_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const CDN_MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

type PoseLandmarkerLike = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    landmarks: Array<Array<{ x: number; y: number; z: number; visibility?: number }>>;
  };
  close?: () => void;
};

async function loadVision() {
  return import("@mediapipe/tasks-vision");
}

async function createLandmarker(wasmPath: string, modelPath: string, delegate: "GPU" | "CPU") {
  const { PoseLandmarker, FilesetResolver } = await loadVision();
  const fileset = await FilesetResolver.forVisionTasks(wasmPath);
  return PoseLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate,
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.4,
    minPosePresenceConfidence: 0.4,
    minTrackingConfidence: 0.4,
    outputSegmentationMasks: false,
  });
}

export class PoseTracker {
  readonly phase = 4;
  readonly implemented = true;
  status: TrackerStatus = "idle";
  error: string | null = null;
  private landmarker: PoseLandmarkerLike | null = null;
  private lastTs = -1;
  mirrored = true;

  async init() {
    if (this.landmarker) {
      this.status = "ready";
      return this;
    }
    this.status = "loading";
    const attempts: Array<{ wasm: string; model: string; delegate: "GPU" | "CPU" }> = [
      { wasm: LOCAL_WASM, model: LOCAL_MODEL, delegate: "GPU" },
      { wasm: LOCAL_WASM, model: LOCAL_MODEL, delegate: "CPU" },
      { wasm: CDN_WASM, model: CDN_MODEL, delegate: "GPU" },
      { wasm: CDN_WASM, model: CDN_MODEL, delegate: "CPU" },
    ];
    let last: unknown;
    for (const attempt of attempts) {
      try {
        this.landmarker = await createLandmarker(attempt.wasm, attempt.model, attempt.delegate);
        this.status = "ready";
        this.error = null;
        return this;
      } catch (error) {
        last = error;
      }
    }
    this.status = "error";
    this.error = last instanceof Error ? last.message : "Pose tracker failed to load.";
    return this;
  }

  detect(video: HTMLVideoElement, timestamp: number, mirrored: boolean): PoseFrame | null {
    if (!this.landmarker || video.readyState < 2) return null;
    this.mirrored = mirrored;
    const ts = timestamp <= this.lastTs ? this.lastTs + 1 : timestamp;
    this.lastTs = ts;
    let result: ReturnType<PoseLandmarkerLike["detectForVideo"]>;
    try {
      result = this.landmarker.detectForVideo(video, ts);
    } catch {
      return null;
    }
    const raw = result.landmarks?.[0];
    if (!raw || raw.length < 13) return null;
    return {
      landmarks: raw.map((p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility })),
      timestamp: ts,
    };
  }

  dispose() {
    try {
      this.landmarker?.close?.();
    } catch {
      /* ignore */
    }
    this.landmarker = null;
    this.status = "idle";
  }
}
