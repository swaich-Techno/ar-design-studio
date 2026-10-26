import type { FaceFrame, TrackingSnapshot, TrackerNeed, TrackerStatus } from "../types";
import { FaceTracker } from "./FaceTracker";
import { HandTracker } from "./HandTracker";
import { PoseTracker } from "./PoseTracker";
import type { AnchorType } from "../types";
import { trackersFor } from "../types";

export class TrackingManager {
  face = new FaceTracker();
  hand = new HandTracker();
  pose = new PoseTracker();
  lastFace: FaceFrame | null = null;
  lastSnapshot: TrackingSnapshot = { face: null, hand: null, pose: null };
  private lastDetectAt = 0;
  private minInterval = 33;
  private detectMs = 16;
  private ensuring: Promise<void> | null = null;

  async init(anchor: AnchorType = "ears") {
    await this.ensure(anchor);
  }

  async ensure(anchor: AnchorType) {
    const need = trackersFor(anchor);
    if (this.ensuring) await this.ensuring;
    const job = this.ensureInner(need);
    this.ensuring = job;
    try {
      await job;
    } finally {
      if (this.ensuring === job) this.ensuring = null;
    }
  }

  private async ensureInner(need: TrackerNeed) {
    const jobs: Promise<unknown>[] = [];
    if (need.face && this.face.status !== "ready") jobs.push(this.face.init());
    if (need.hand && this.hand.status !== "ready" && this.hand.status !== "error") jobs.push(this.hand.init());
    if (need.pose && this.pose.status !== "ready" && this.pose.status !== "error") jobs.push(this.pose.init());
    await Promise.all(jobs);
  }

  statusFor(anchor: AnchorType): TrackerStatus {
    const need = trackersFor(anchor);
    if (need.hand) {
      if (this.hand.status === "idle") return "loading";
      return this.hand.status;
    }
    if (need.pose) {
      if (this.face.status === "ready") return "ready";
      if (this.pose.status === "ready") return "ready";
      if (this.face.status === "loading" || this.pose.status === "loading" || this.face.status === "idle") {
        return "loading";
      }
      if (this.face.status === "error" && (this.pose.status === "error" || this.pose.status === "unsupported")) {
        return "error";
      }
      return this.face.status;
    }
    if (this.face.status === "idle") return "loading";
    return this.face.status;
  }

  errorFor(anchor: AnchorType): string | null {
    const need = trackersFor(anchor);
    if (need.hand && this.hand.error) return this.hand.error;
    if (need.pose && this.pose.error && this.face.error) return this.pose.error || this.face.error;
    if (need.face && this.face.error && !need.pose) return this.face.error;
    return null;
  }

  update(video: HTMLVideoElement, timestamp: number, mirrored: boolean, need: TrackerNeed): TrackingSnapshot {
    const interval = Math.max(this.minInterval, Math.min(66, this.detectMs * 1.6));
    if (timestamp - this.lastDetectAt < interval) return this.lastSnapshot;
    const t0 = performance.now();
    const next: TrackingSnapshot = {
      face: need.face ? this.face.detect(video, timestamp, mirrored) : null,
      hand: need.hand ? this.hand.detect(video, timestamp, mirrored) : null,
      pose: need.pose ? this.pose.detect(video, timestamp, mirrored) : null,
    };
    this.detectMs = performance.now() - t0;
    this.lastDetectAt = timestamp;
    if (next.face) this.lastFace = next.face;
    else if (need.face && timestamp - (this.lastFace?.timestamp ?? 0) > 150) this.lastFace = null;
    if (need.face && !next.face) next.face = this.lastFace;
    if (need.hand && !next.hand && timestamp - (this.lastSnapshot.hand?.timestamp ?? 0) < 150) {
      next.hand = this.lastSnapshot.hand;
    }
    if (need.pose && !next.pose && timestamp - (this.lastSnapshot.pose?.timestamp ?? 0) < 150) {
      next.pose = this.lastSnapshot.pose;
    }
    this.lastSnapshot = next;
    return next;
  }

  dispose() {
    this.face.dispose();
    this.hand.dispose();
    this.pose.dispose();
    this.lastFace = null;
    this.lastSnapshot = { face: null, hand: null, pose: null };
  }
}
