"use client";

import { useCallback, useRef, useState } from "react";

export function PhotoInspect({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const [rot, setRot] = useState({ x: 6, y: -10 });
  const [zoom, setZoom] = useState(1);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, rx: rot.x, ry: rot.y };
  }, [rot]);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    setRot({
      x: Math.max(-28, Math.min(28, drag.current.rx + dy * 0.18)),
      y: Math.max(-40, Math.min(40, drag.current.ry + dx * 0.22)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  function fullscreen() {
    const el = stage.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void el.requestFullscreen?.();
  }

  return (
    <div ref={stage} className={`relative overflow-hidden bg-[#0c0b0a] ${className}`}>
      <div
        className="grid h-full min-h-[320px] w-full cursor-grab place-items-center active:cursor-grabbing"
        style={{ perspective: "1400px", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-[min(72vh,560px)] w-[min(88%,420px)] rounded-[28px] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          style={{
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${zoom})`,
            transition: drag.current ? "none" : "transform 160ms ease-out",
          }}
        />
      </div>
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em]">
          Drag · Zoom
        </span>
        <button type="button" className="min-h-11 rounded-full border border-white/15 bg-black/40 px-3 text-xs" onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}>
          +
        </button>
        <button type="button" className="min-h-11 rounded-full border border-white/15 bg-black/40 px-3 text-xs" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}>
          −
        </button>
        <button type="button" className="min-h-11 rounded-full border border-white/15 bg-black/40 px-3 text-xs" onClick={fullscreen}>
          Fullscreen
        </button>
      </div>
    </div>
  );
}
