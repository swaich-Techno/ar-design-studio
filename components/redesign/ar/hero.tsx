"use client";

import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { ArBeatCaption } from "@/components/redesign/ar/beat-caption";
import { ArHeroLoop } from "@/components/redesign/ar/hero-loop";
import { copy, foodDemo, site, waLink } from "@/lib/redesign/site";

export function ArHero() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,rgba(139,124,255,0.14),transparent_56%)]" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 content-center gap-8 px-5 pb-16 pt-28 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-center md:px-10 md:pt-24 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,40%)]">
          <div className="relative z-20 min-w-0">
            <p className="kicker">{copy.ar.heroEyebrow}</p>
            <h1 className="headline mt-4 max-w-[16ch] text-[clamp(2.4rem,6.8vw,6.2rem)] text-[#f3efe6]">
              <span className="block">{copy.ar.heroTitle[0]}</span>
              <span className="block">{copy.ar.heroTitle[1]}</span>
            </h1>
            <p className="mt-4 max-w-xl text-[var(--fg)]/75">{copy.ar.heroSupport}</p>
            <p className="mt-3 max-w-xl text-sm text-muted">{copy.ar.heroSecondary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Button asChild size="lg" variant="gold">
                  <Link href="/ar/demo">EXPERIENCE THE MENU</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/contact">REQUEST A DEMO</Link>
                </Button>
              </Magnetic>
              <a
                className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline-offset-4 hover:text-white hover:underline"
                href={waLink(site.whatsapp.ar, "Hi — I want a Food AR demo.")}
              >
                Talk on WhatsApp
              </a>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">{copy.ar.trust}</p>
          </div>
          <div className="relative z-10 w-full min-w-0">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[520px] md:mx-0 md:aspect-auto md:h-[min(58vh,500px)] md:max-w-none">
              <ArHeroLoop kind="food" priority />
            </div>
            <ArBeatCaption className="mt-4" />
          </div>
        </div>
      </section>
      <section className="relative z-10 px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="kicker mb-6">Hero dishes</p>
          <div className="grid gap-4 md:grid-cols-3">
            {foodDemo.map((item) => (
              <Link
                key={item.slug}
                href={`/ar/demo/${item.slug}`}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-black/35"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} className="aspect-square w-full object-cover" />
                <div className="px-6 py-8">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--tomato)]">
                    {item.veg ? "Veg" : "Non-veg"} · DEMO PRICE {item.price}
                  </p>
                  <h2 className="headline mt-3 text-[clamp(1.6rem,3vw,2.4rem)]">{item.name}</h2>
                  <p className="mt-3 max-w-sm text-sm text-muted">See on My Table · View in 3D</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
