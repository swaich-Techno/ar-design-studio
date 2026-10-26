"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoProduct } from "@/lib/redesign/site";
import { demoWhatsApp, foodActualSizeLabel, foodDemo } from "@/lib/redesign/site";
import { Button } from "@/components/redesign/ui/button";

type ModelViewerEl = HTMLElement & {
  activateAR?: () => Promise<void>;
  src?: string;
  iosSrc?: string;
};

export function FoodTableAr({
  product,
  catalog = foodDemo,
  onSelect,
  autoLaunch = false,
  onClose,
}: {
  product: DemoProduct;
  catalog?: readonly DemoProduct[];
  onSelect?: (slug: string) => void;
  autoLaunch?: boolean;
  onClose?: () => void;
}) {
  const viewerRef = useRef<ModelViewerEl | null>(null);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");
  const dishes = catalog.filter((item) => item.vertical === "food");

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

  useEffect(() => {
    if (!ready || !autoLaunch) return;
    const id = window.setTimeout(() => {
      void launchAR();
    }, 400);
    return () => window.clearTimeout(id);
  }, [ready, autoLaunch]);

  async function launchAR() {
    const viewer = viewerRef.current;
    if (viewer && typeof viewer.activateAR === "function") {
      try {
        await viewer.activateAR();
        setNote("");
        return;
      } catch {
        setNote("Point your phone at a table. The browser will look for a flat surface, then tap to place the dish.");
        return;
      }
    }
    setNote("Camera placement needs a supported mobile browser (Android Scene Viewer or iPhone Quick Look).");
  }

  return (
    <div className="flex min-h-[100svh] flex-col overflow-hidden bg-[#12080a] text-[var(--fg)] md:min-h-[560px] md:rounded-[28px] md:border md:border-white/10">
      <div className="relative min-h-[58svh] flex-1 md:min-h-[420px]">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/50 text-lg"
            aria-label="Close"
          >
            ×
          </button>
        ) : null}
        {!ready ? (
          <div className="absolute inset-0 z-10 grid place-items-center text-sm text-muted">Opening table view…</div>
        ) : null}
        {ready ? (
          <model-viewer
            ref={(el: HTMLElement | null) => {
              viewerRef.current = el as ModelViewerEl | null;
            }}
            src={product.glb}
            ios-src={product.usdz}
            poster={product.imageUrl}
            alt={`${product.name} on the table`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            ar-scale="fixed"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            shadow-softness="0.9"
            exposure="1"
            touch-action="pan-y"
            camera-orbit="0deg 65deg 130%"
            style={{ width: "100%", height: "100%", minHeight: "58svh", background: "#12080a" }}
          >
            <button
              slot="ar-button"
              type="button"
              className="absolute bottom-4 left-1/2 z-10 min-h-12 -translate-x-1/2 rounded-full bg-[var(--gold)] px-7 text-sm font-medium text-black"
            >
              SEE ON MY TABLE
            </button>
          </model-viewer>
        ) : null}
      </div>

      <div className="space-y-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--gold)]">{product.label}</p>
            <p className="font-display text-2xl">{product.name}</p>
            <p className="text-sm text-muted">DEMO PRICE {product.price}</p>
          </div>
          <p className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
            {foodActualSizeLabel(product)}
          </p>
        </div>
        <p className="text-xs text-muted">
          Interactive Demo · photo card on your table, not a photogrammetry mesh. Find a flat surface, tap to place, then walk around — it stays on the table.
        </p>
        {dishes.length ? (
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {dishes.map((item) => {
              const active = item.slug === product.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => onSelect?.(item.slug)}
                  className={`min-w-[84px] shrink-0 overflow-hidden rounded-2xl border text-left ${
                    active ? "border-[var(--amber)] bg-white/10" : "border-white/15 bg-black/35"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" className="h-16 w-full object-cover" />
                  <span className="block max-w-[96px] truncate px-2 py-1.5 text-[10px] uppercase tracking-[0.12em]">
                    {item.name.replace("Signature ", "")}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">No dishes to show yet.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="gold" className="min-h-12 flex-1" onClick={() => void launchAR()}>
            SEE ON MY TABLE
          </Button>
          <Button asChild variant="ghost" className="min-h-12">
            <a href={demoWhatsApp(product)}>Enquire</a>
          </Button>
        </div>
        {note ? <p className="text-xs text-muted">{note}</p> : null}
      </div>
    </div>
  );
}
