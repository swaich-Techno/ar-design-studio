"use client";

import { MiniPreview } from "@/components/redesign/3d/lazy";

export function NavPreview({ kind }: { kind: "food" | null }) {
  if (!kind) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-20 hidden -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/70 md:block">
      <MiniPreview kind={kind} />
    </div>
  );
}
