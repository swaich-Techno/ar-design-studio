import type { HandFrame, TrackerStatus } from "../types";

const LOCAL_WASM = "/mediapipe/wasm";
const LOCAL_MODEL = "/mediapipe/hand_landmarker.task";
const CDN_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const CDN_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

type HandLandmarkerLike = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    landmarks: Array<Array<{ x: number; y: number; z: number }>>;
    worldLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
    handedness?: Array<Array<{ categoryName?: string }>>;
    handednesses?: Array<Array<{ categoryName?: string }>>;
  };
  close?: () => void;
};

async function loadVision() {
  return import("@mediapipe/tasks-vision");
}

async function createLandmarker(wasmPath: string, modelPath: string, delegate: "GPU" | "CPU") {
  const { HandLandmarker, FilesetResolver } = await loadVision();
  const fileset = await FilesetResolver.forVisionTasks(wasmPath);
  return HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate,
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.45,
    minHandPresenceConfidence: 0.45,
    minTrackingConfidence: 0.45,
  });
}

function pickHand(result: ReturnType<HandLandmarkerLike["detectForVideo"]>) {
  const hands = result.landmarks ?? [];
  if (!hands.length) return -1;
  let best = 0;
  let bestScore = -1;
  for (let i = 0; i < hands.length; i += 1) {
    const lm = hands[i];
    if (!lm || lm.length < 17) continue;
    const mcp = lm[13];
    const pip = lm[14];
    const span = Math.hypot(pip.x - mcp.x, pip.y - mcp.y);
    if (span > bestScore) {
      bestScore = span;
      best = i;
    }
  }
  return bestScore > 0 ? best : 0;
}

export class HandTracker {
  readonly phase = 3;
  readonly implemented = true;
  status: TrackerStatus = "idle";
  error: string | null = null;
  private landmarker: HandLandmarkerLike | null = null;
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
    this.error = last instanceof Error ? last.message : "Hand tracker failed to load.";
    return this;
  }

  detect(video: HTMLVideoElement, timestamp: number, mirrored: boolean): HandFrame | null {
    if (!this.landmarker || video.readyState < 2) return null;
    this.mirrored = mirrored;
    const ts = timestamp <= this.lastTs ? this.lastTs + 1 : timestamp;
    this.lastTs = ts;
    let result: ReturnType<HandLandmarkerLike["detectForVideo"]>;
    try {
      result = this.landmarker.detectForVideo(video, ts);
    } catch {
      return null;
    }
    const index = pickHand(result);
    const raw = result.landmarks?.[index];
    if (!raw || raw.length < 21) return null;
    const handed =
      result.handedness?.[index]?.[0]?.categoryName ||
      result.handednesses?.[index]?.[0]?.categoryName ||
      "Unknown";
    const world = result.worldLandmarks?.[index];
    return {
      landmarks: raw.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      worldLandmarks: world ? world.map((p) => ({ x: p.x, y: p.y, z: p.z })) : null,
      handedness: handed === "Left" || handed === "Right" ? handed : "Unknown",
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
