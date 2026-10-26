"use client";

import { useEffect, useMemo, useState } from "react";
import { FoodDemoStudio } from "@/components/redesign/ar/food-demo";
import { RealQr } from "@/components/redesign/ar/real-qr";
import { DemoRequestForm } from "@/components/redesign/forms/demo-request-form";
import { demoPagePath, foodDemo, site, waLink } from "@/lib/redesign/site";

export function DemoStudio() {
  const [slug, setSlug] = useState<string>(foodDemo[0].slug);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const item = params.get("item");
    const match = item ? foodDemo.find((p) => p.slug === item) : undefined;
    if (match) {
      setSlug(match.slug);
    }
  }, []);

  const current = useMemo(() => {
    return foodDemo.find((p) => p.slug === slug) ?? foodDemo[0];
  }, [slug]);

  return (
    <section className="space-y-20 px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Interactive Demo</p>
        <h1 className="headline mt-4 max-w-[14ch] text-[clamp(2.8rem,7vw,6rem)]">SEE IT ON THE TABLE</h1>
        <p className="mt-5 max-w-xl text-muted">
          Three hero dishes. Inspect the photograph, place it on your table, view in 3D, scan the QR, then enquire on
          WhatsApp.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <FoodDemoStudio selected={current.slug} onSelect={setSlug} />
        </div>
        <aside className="lg:block">
          <div className="sticky top-28 rounded-[28px] border border-white/10 p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">QR for this product</p>
            <RealQr
              path={demoPagePath(current.slug)}
              label={`Scan to open ${current.name} on your phone.`}
            />
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-[var(--gold)]">
              DEMO PRICE {current.price}
            </p>
          </div>
        </aside>
      </div>
      <section id="request" className="mx-auto grid max-w-[1100px] gap-12 scroll-mt-28 md:grid-cols-2">
        <div>
          <p className="kicker">Request Demo</p>
          <h2 className="headline mt-4 text-[clamp(2.2rem,5vw,4rem)]">Request My Demo</h2>
          <p className="mt-4 text-muted">Food AR pilot. We’ll start with a few hero dishes.</p>
          <a className="mt-6 inline-flex min-h-11 items-center text-sm text-muted" href={waLink(site.whatsapp.ar, "Hi — I want a Food AR demo.")}>
            Talk on WhatsApp · {site.phoneDisplay}
          </a>
        </div>
        <DemoRequestForm context="ar" />
      </section>
    </section>
  );
}
