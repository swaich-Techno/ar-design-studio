"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoProduct } from "@/lib/redesign/site";

export function DemoArViewer({ product }: { product: DemoProduct }) {
  const viewerRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    let mounted = true;
    import("@google/model-viewer")
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch(() => {
        if (mounted) setNote("3D viewer could not load. You can still inspect the photograph.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function launchAR() {
    const viewer = viewerRef.current as { activateAR?: () => Promise<void> } | null;
    if (viewer && typeof viewer.activateAR === "function") {
      try {
        await viewer.activateAR();
        return;
      } catch {
        setNote("If the browser blocks auto-launch, use View in your space inside the viewer.");
        return;
      }
    }
    setNote("Camera placement needs a supported mobile browser (Android Scene Viewer or iPhone Quick Look).");
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0b0a]">
      <div className="relative min-h-[360px]">
        {!ready ? (
          <div className="absolute inset-0 z-10 grid place-items-center text-sm text-muted">Loading 3D card…</div>
        ) : null}
        {ready ? (
          <model-viewer
            ref={(el: HTMLElement | null) => {
              viewerRef.current = el;
            }}
            src={product.glb}
            ios-src={product.usdz}
            poster={product.imageUrl}
            alt={`${product.name} interactive demo card`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            ar-scale="auto"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            touch-action="pan-y"
            camera-orbit="0deg 70deg 120%"
            style={{ width: "100%", height: "420px", background: "#0c0b0a" }}
          >
            <button
              slot="ar-button"
              type="button"
              className="absolute bottom-4 left-4 inline-flex min-h-11 items-center rounded-full bg-[var(--gold)] px-5 text-sm text-black"
            >
              View in your space
            </button>
          </model-viewer>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-4 py-3 text-xs text-muted">
        <p>Interactive Demo · photo card you can place on a table.</p>
        <button type="button" className="min-h-11 rounded-full border border-white/15 px-4 text-xs" onClick={launchAR}>
          View in AR
        </button>
      </div>
      {note ? <p className="px-4 pb-3 text-xs text-muted">{note}</p> : null}
    </div>
  );
}
