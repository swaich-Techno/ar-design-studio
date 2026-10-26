import type {
  EarAnchor,
  OverlayAnchor,
  ResolvedCalibration,
  TrackingSnapshot,
  TryOnProduct,
  ViewportMap,
} from "../types";

export interface JewelleryAnchor<T = OverlayAnchor | null> {
  readonly category: TryOnProduct["category"] | "generic";
  readonly implemented: boolean;
  compute(
    tracking: TrackingSnapshot,
    product: TryOnProduct,
    calibration: ResolvedCalibration,
    viewport: ViewportMap,
  ): T | null;
}

export type { EarAnchor, OverlayAnchor };
