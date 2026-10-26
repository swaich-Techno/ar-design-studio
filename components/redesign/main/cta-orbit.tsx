"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/redesign/use-near-viewport";
import { ExperienceCoreFallback } from "@/components/redesign/3d/fallbacks";

const ExperienceCoreCanvas = dynamic(
  () => import("@/components/redesign/main/cta-orbit-gl").then((m) => m.ExperienceCoreCanvas),
  { ssr: false, loading: () => <ExperienceCoreFallback /> },
);

export function CtaOrbit() {
  const [ref, near] = useNearViewport("240px");
  return (
    <div ref={ref} className="xcore-wrap">
      {near ? <ExperienceCoreCanvas /> : <ExperienceCoreFallback />}
    </div>
  );
}
