"use client";

import { SceneCanvas } from "@/components/redesign/3d/scene-canvas";
import { ExperienceCoreWorld } from "@/components/redesign/3d/experience-core";
import { ExperienceCoreFallback } from "@/components/redesign/3d/fallbacks";

export function ExperienceCoreCanvas() {
  return (
    <SceneCanvas
      pauseOffscreen
      className="h-full w-full"
      camera={{ position: [0.2, 0.08, 3.55], fov: 30 }}
      fallback={<ExperienceCoreFallback />}
    >
      <ExperienceCoreWorld />
    </SceneCanvas>
  );
}
