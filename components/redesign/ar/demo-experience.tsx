"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DemoProduct } from "@/lib/redesign/site";
import { demoPagePath, demoWhatsApp, foodDemo, site } from "@/lib/redesign/site";
import { PhotoInspect } from "@/components/redesign/ar/photo-inspect";
import { FoodTableAr } from "@/components/redesign/ar/food-table-ar";
import { RealQr } from "@/components/redesign/ar/real-qr";
import { Button } from "@/components/redesign/ui/button";
import { ArLogo } from "@/components/redesign/brand/logo";

export function DemoExperience({ product }: { product: DemoProduct }) {
  const [mode, setMode] = useState<"photo" | "ar">("photo");
  const [foodSlug, setFoodSlug] = useState(product.slug);
  const currentFood = foodDemo.find((item) => item.slug === foodSlug) ?? product;
  const shown = currentFood;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "ar") setMode("ar");
  }, []);

  if (mode === "ar") {
    return (
      <div className="min-h-[100svh] bg-[#12080a] text-[var(--fg)]">
        <FoodTableAr
          product={shown}
          catalog={foodDemo}
          onSelect={setFoodSlug}
          autoLaunch
          onClose={() => setMode("photo")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#080809] text-[var(--fg)]">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-[#080809]/85 px-4 py-3 backdrop-blur-md">
        <Link href="/ar/demo" className="optical-glass rounded-full px-3 py-2">
          <ArLogo />
        </Link>
        <Link href="/ar/demo" className="text-xs uppercase tracking-[0.16em] text-muted">
          All demos
        </Link>
      </header>

      <section className="px-0">
        <PhotoInspect src={shown.imageUrl} alt={shown.name} className="h-[min(78svh,640px)] w-full" />
      </section>

      <section className="px-5 pb-36 pt-6">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--gold)]">{shown.label}</p>
        <h1 className="headline mt-2 text-[clamp(2rem,8vw,3.4rem)]">{shown.name}</h1>
        <p className="mt-2 text-sm text-muted">SKU {shown.sku}</p>
        <p className="mt-3 text-lg">
          <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--gold)]">DEMO PRICE</span>{" "}
          <span className="font-display text-2xl">{shown.price}</span>
        </p>
        <p className="mt-4 max-w-xl text-[var(--fg)]/80">{shown.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" variant="gold" onClick={() => setMode("ar")}>
            SEE ON MY TABLE
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/ar/demo/${shown.slug}`}>View in 3D</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={demoWhatsApp(shown)}>Enquire</a>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">
          SEE ON MY TABLE places a photo card of this dish on a detected table at actual size. Interactive Demo — not a
          photogrammetry mesh.
        </p>

        <div className="mt-8 rounded-[28px] border border-white/10 p-5">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Share this product</p>
          <RealQr path={demoPagePath(shown.slug)} label="Each dish has its own QR and URL." />
        </div>

        <p className="mt-8 text-sm text-muted">WhatsApp {site.phoneDisplay}</p>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 p-3">
        <a
          href={demoWhatsApp(shown)}
          className="flex min-h-12 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm text-black"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
