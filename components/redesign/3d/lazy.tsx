"use client";

import dynamic from "next/dynamic";
import { SceneCanvas } from "@/components/redesign/3d/scene-canvas";
import { FoodWorld } from "@/components/redesign/3d/food-world";
import { DessertPlate } from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { FoodFallback } from "@/components/redesign/3d/fallbacks";
import { bindSectionScroll } from "@/lib/redesign/scroll-rig";
import { useEffect, useRef } from "react";

export function FoodCanvas({ dish = "lava" }: { dish?: "lava" | "burger" | "mocktail" }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current?.closest("section") ?? wrap.current;
    if (!el) return;
    return bindSectionScroll(el, "food");
  }, []);
  return (
    <div ref={wrap} className="absolute inset-0 z-[1]">
      <SceneCanvas camera={{ position: [0, 0.28, 4.45], fov: 30 }} fallback={<FoodFallback />} pauseOffscreen>
        <FoodWorld dish={dish} />
      </SceneCanvas>
    </div>
  );
}

export function MiniPreview({ kind }: { kind: "food" | null }) {
  if (kind !== "food") return null;
  return (
    <SceneCanvas className="h-24 w-24" camera={{ position: [0, 0.2, 3.2], fov: 35 }}>
      <StudioLights />
      <DessertPlate />
    </SceneCanvas>
  );
}

export const OrbitCanvasDynamic = dynamic(
  () => import("@/components/redesign/3d/orbit-canvas").then((m) => m.OrbitCanvas),
  { ssr: false },
);

export const PortalCanvasDynamic = dynamic(
  () => import("@/components/redesign/3d/portal-canvas").then((m) => m.PortalCanvas),
  { ssr: false },
);
