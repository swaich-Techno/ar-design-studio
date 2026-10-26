"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/lib/redesign/pointer";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-custom-cursor");
    let raf = 0;
    let rx = 0;
    let ry = 0;
    const tick = () => {
      rx += (pointer.x - rx) * 0.18;
      ry += (pointer.y - ry) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hover = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = Boolean(target?.closest("a,button,[data-cursor='grow']"));
      if (ring.current) {
        ring.current.style.width = interactive ? "44px" : "28px";
        ring.current.style.height = interactive ? "44px" : "28px";
        ring.current.style.margin = interactive ? "-22px 0 0 -22px" : "-14px 0 0 -14px";
      }
    };
    window.addEventListener("pointerover", hover);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerover", hover);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
