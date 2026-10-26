"use client";

import { useRef } from "react";
import { SceneCanvas } from "@/components/redesign/3d/scene-canvas";
import { MaterialiseWorld } from "@/components/redesign/3d/materialise-world";
import { ArBreakoutWorld } from "@/components/redesign/3d/ar-breakout-world";
import { MaterialiseFallback, ArBreakoutFallback } from "@/components/redesign/3d/fallbacks";

export function MaterialiseCanvas() {
  const hoverRef = useRef(false);
  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <SceneCanvas
        pauseOffscreen
        camera={{ position: [0, 0.12, 3.7], fov: 32 }}
        fallback={<MaterialiseFallback />}
      >
        <MaterialiseWorld hoverRef={hoverRef} />
      </SceneCanvas>
    </div>
  );
}

export function ArBreakoutCanvas() {
  const hoverRef = useRef(false);
  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <SceneCanvas
        pauseOffscreen
        camera={{ position: [0.15, 0.2, 3.6], fov: 34 }}
        fallback={<ArBreakoutFallback />}
      >
        <ArBreakoutWorld hoverRef={hoverRef} />
      </SceneCanvas>
    </div>
  );
}
