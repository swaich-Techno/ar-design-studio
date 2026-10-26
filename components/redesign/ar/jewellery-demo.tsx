"use client";

import { useState } from "react";
import Link from "next/link";
import { jewelleryDemo, demoTryOnPath, demoWhatsApp } from "@/lib/redesign/site";
import { PhotoInspect } from "@/components/redesign/ar/photo-inspect";
import { Button } from "@/components/redesign/ui/button";

export function JewelleryDemo({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (slug: string) => void;
}) {
  const [internal, setInternal] = useState<string>(jewelleryDemo[0]?.slug ?? "");
  const slug = selected && jewelleryDemo.some((p) => p.slug === selected) ? selected : internal;
  const current = jewelleryDemo.find((p) => p.slug === slug) ?? jewelleryDemo[0];

  function pick(next: string) {
    setInternal(next);
    onSelect?.(next);
  }

  if (!jewelleryDemo.length || !current) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-[#0c0b0a] px-6 py-16 text-center">
        <p className="text-sm text-muted">No jewellery pieces to show yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0b0a]">
      <PhotoInspect src={current.imageUrl} alt={current.name} className="h-[min(72vw,460px)]" />
      <div className="grid grid-cols-2 gap-3 border-t border-white/8 p-4 sm:grid-cols-3 lg:grid-cols-4">
        {jewelleryDemo.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => pick(item.slug)}
            className={`min-h-11 overflow-hidden rounded-2xl border text-left ${
              current.slug === item.slug ? "border-[var(--gold)] bg-white/5" : "border-white/10"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
            <span className="block px-3 py-2 text-sm">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--gold)]">{current.label}</p>
          <p className="font-display mt-1 text-3xl">{current.name}</p>
          <p className="mt-1 text-sm text-muted">
            DEMO PRICE {current.price} · SKU {current.sku}
          </p>
          <p className="mt-2 max-w-md text-sm text-muted">{current.description}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
            Try On Me · {current.category === "ring" ? "ring on your hand" : current.category === "pendant" ? "pendant on your neck" : "necklace on your neck"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="gold">
            <Link href={demoTryOnPath(current)}>Try On Me</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/ar/demo/${current.slug}`}>View in 3D</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={demoWhatsApp(current)}>Enquire</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
