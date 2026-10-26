"use client";

import { SceneCanvas } from "@/components/redesign/3d/scene-canvas";
import { ArExplainerWorld } from "@/components/redesign/3d/ar-explainer-world";
import { ArExplainerFallback } from "@/components/redesign/3d/fallbacks";
import type { ArExplainerKind } from "@/lib/redesign/ar-beats";

export function ArExplainerCanvas({
  lockKind = null,
  className,
}: {
  lockKind?: ArExplainerKind | null;
  className?: string;
}) {
  return (
    <div className={className ?? "absolute inset-0"}>
      <SceneCanvas
        camera={{ position: [0.12, 0.92, 3.05], fov: 34 }}
        fallback={<ArExplainerFallback />}
      >
        <ArExplainerWorld lockKind={lockKind} />
      </SceneCanvas>
    </div>
  );
}
