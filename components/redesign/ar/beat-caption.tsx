"use client";

import { useEffect, useState } from "react";
import { arBeats, beatFromElapsed, AR_START_OFFSET, type ArBeatIndex } from "@/lib/redesign/ar-beats";
import { cn } from "@/lib/redesign/utils";

export function ArBeatCaption({ className }: { className?: string }) {
  const [beat, setBeat] = useState<ArBeatIndex>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBeat(1);
      return;
    }
    const started = performance.now() - AR_START_OFFSET * 1000;
    const tick = () => setBeat(beatFromElapsed((performance.now() - started) / 1000));
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <ol className={cn("grid grid-cols-3 gap-2", className)} aria-label="How B Socio AR works">
      {arBeats.map((item, index) => {
        const active = beat === index;
        return (
          <li
            key={item.n}
            aria-current={active ? "step" : undefined}
            className={cn(
              "rounded-2xl border px-3 py-3 transition-colors duration-500",
              active ? "border-[var(--accent-2)]/55 bg-white/[0.07]" : "border-white/10 bg-black/20",
            )}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{item.n}</p>
            <p className="mt-1 font-display text-sm md:text-base">{item.title}</p>
            <p className="mt-1 hidden text-[11px] leading-snug text-[var(--fg)]/65 sm:block">{item.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
