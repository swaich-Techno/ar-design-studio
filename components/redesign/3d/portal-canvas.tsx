"use client";

import { ArExplainerCanvas } from "@/components/redesign/3d/ar-explainer-canvas";
import type { ArExplainerKind } from "@/lib/redesign/ar-beats";

export function PortalCanvas({ bias = 0 }: { bias?: number }) {
  const lockKind: ArExplainerKind | null = bias > 0 ? "jewellery" : bias < 0 ? "food" : null;
  return <ArExplainerCanvas lockKind={lockKind} />;
}
