"use client";

import { useState } from "react";
import { foodDemo, demoWhatsApp } from "@/lib/redesign/site";
import { PhotoInspect } from "@/components/redesign/ar/photo-inspect";
import { FoodTableAr } from "@/components/redesign/ar/food-table-ar";
import { Button } from "@/components/redesign/ui/button";

export function FoodDemoStudio({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (slug: string) => void;
}) {
  const [internal, setInternal] = useState<string>(foodDemo[0]?.slug ?? "");
  const [mode, setMode] = useState<"photo" | "table">("photo");
  const slug = selected && foodDemo.some((p) => p.slug === selected) ? selected : internal;
  const current = foodDemo.find((p) => p.slug === slug) ?? foodDemo[0];

  function pick(next: string) {
    setInternal(next);
    onSelect?.(next);
  }

  if (!foodDemo.length || !current) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-[#16090c] px-6 py-16 text-center">
        <p className="text-sm text-muted">No dishes to show yet.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="kicker">Interactive Demo</p>
      <h2 className="headline mt-3 text-[clamp(2.2rem,5vw,4rem)]">{current.name}</h2>
      <p className="mt-3 max-w-lg text-muted">{current.description}</p>
      {mode === "table" ? (
        <div className="fixed inset-0 z-[70]">
          <FoodTableAr
            product={current}
            catalog={foodDemo}
            onSelect={pick}
            autoLaunch
            onClose={() => setMode("photo")}
          />
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#16090c]">
          <PhotoInspect src={current.imageUrl} alt={current.name} className="h-[min(72vw,440px)]" />
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-3">
            {foodDemo.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => pick(item.slug)}
                className={`min-h-11 overflow-hidden rounded-2xl border text-left ${
                  current.slug === item.slug ? "border-[var(--amber)] bg-white/5" : "border-white/10"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    {item.veg ? "Veg" : "Non-veg"} · DEMO PRICE {item.price}
                  </p>
                  <p className="mt-2 font-display text-xl">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/8 p-5">
            <p className="w-full text-sm text-muted">
              {current.label} · DEMO PRICE {current.price} · SKU {current.sku}
            </p>
            <Button type="button" variant="gold" className="min-h-12" onClick={() => setMode("table")}>
              SEE ON MY TABLE
            </Button>
            <Button asChild variant="ghost">
              <a href={`/ar/demo/${current.slug}`}>View in 3D</a>
            </Button>
            <Button asChild variant="ghost">
              <a href={demoWhatsApp(current)}>Enquire</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
