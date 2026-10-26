import type { FaceFrame, Landmark, TrackerStatus } from "../types";
import { poseFromLandmarks, poseFromMatrix } from "../utils/transforms";

const LOCAL_WASM = "/mediapipe/wasm";
const LOCAL_MODEL = "/mediapipe/face_landmarker.task";
    const CDN_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const CDN_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type FaceLandmarkerLike = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    faceLandmarks: Array<Array<{ x: number; y: number; z: number }>>;
    facialTransformationMatrixes?: Array<{ data: Float32Array | number[] }>;
  };
  close?: () => void;
};

async function loadVision() {
  return import("@mediapipe/tasks-vision");
}

async function createLandmarker(wasmPath: string, modelPath: string, delegate: "GPU" | "CPU") {
  const { FaceLandmarker, FilesetResolver } = await loadVision();
  const fileset = await FilesetResolver.forVisionTasks(wasmPath);
  return FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate,
    },
    runningMode: "VIDEO",
    numFaces: 1,
    minFaceDetectionConfidence: 0.45,
    minFacePresenceConfidence: 0.45,
    minTrackingConfidence: 0.45,
    outputFacialTransformationMatrixes: true,
    outputFaceBlendshapes: false,
  });
}

export class FaceTracker {
  status: TrackerStatus = "idle";
  error: string | null = null;
  private landmarker: FaceLandmarkerLike | null = null;
  private lastTs = -1;
  mirrored = true;

  async init() {
    if (this.landmarker) {
      this.status = "ready";
      return;
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
        return;
      } catch (error) {
        last = error;
      }
    }
    this.status = "error";
    this.error = last instanceof Error ? last.message : "Face tracker failed to load.";
  }

  detect(video: HTMLVideoElement, timestamp: number, mirrored: boolean): FaceFrame | null {
    if (!this.landmarker || video.readyState < 2) return null;
    this.mirrored = mirrored;
    const ts = timestamp <= this.lastTs ? this.lastTs + 1 : timestamp;
    this.lastTs = ts;
    let result: ReturnType<FaceLandmarkerLike["detectForVideo"]>;
    try {
      result = this.landmarker.detectForVideo(video, ts);
    } catch {
      return null;
    }
    const raw = result.faceLandmarks?.[0];
    if (!raw || raw.length < 400) return null;
    const landmarks: Landmark[] = raw.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    const matrix = result.facialTransformationMatrixes?.[0]?.data
      ? Float32Array.from(result.facialTransformationMatrixes[0].data)
      : null;
    const fromMatrix = matrix ? poseFromMatrix(matrix, mirrored) : null;
    const fromLm = poseFromLandmarks(landmarks, mirrored);
    const pose = fromMatrix
      ? {
          yaw: fromMatrix.yaw,
          pitch: fromMatrix.pitch,
          roll: fromLm.roll,
          scale: fromLm.scale,
        }
      : fromLm;
    return { landmarks, pose, matrix, timestamp: ts };
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
