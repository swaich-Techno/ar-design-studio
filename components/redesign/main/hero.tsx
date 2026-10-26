"use client";

import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { ArBeatCaption } from "@/components/redesign/ar/beat-caption";
import { ArHeroLoop } from "@/components/redesign/ar/hero-loop";
import { copy, site, waLink } from "@/lib/redesign/site";

const STEPS = ["MENU", "3D", "AR", "ORDER"] as const;

export function MainHero() {
  return (
    <section className="relative overflow-hidden bg-[#080809]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(74,22,29,0.45),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(212,120,58,0.12),transparent_50%)]" />
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 content-center gap-6 px-5 pb-32 pt-28 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-center md:gap-10 md:px-10 md:pb-16 md:pt-24 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,40%)]">
        <div className="relative z-20 order-1 min-w-0">
          <p className="kicker">{copy.ar.heroEyebrow}</p>
          <h1 className="headline mt-4 max-w-[16ch] text-[clamp(2.4rem,6.8vw,6.2rem)] text-[#f3efe6]">
            <span className="block">{copy.ar.heroTitle[0]}</span>
            <span className="block">{copy.ar.heroTitle[1]}</span>
          </h1>
        </div>
        <div className="relative z-10 order-2 w-full min-w-0 md:row-span-2">
          <div className="food-hero-stage relative mx-auto aspect-[16/9] w-full max-w-[520px] md:mx-0 md:aspect-auto md:h-[min(62vh,520px)] md:max-w-none">
            <div className="food-hero-grid" aria-hidden />
            <ArHeroLoop kind="food" priority />
            <ol className="food-hero-steps" aria-label="From menu to order">
              {STEPS.map((step, index) => (
                <li key={step}>
                  <span>{step}</span>
                  {index < STEPS.length - 1 ? <span aria-hidden>→</span> : null}
                </li>
              ))}
            </ol>
          </div>
          <ArBeatCaption className="mt-4" />
        </div>
        <div className="relative z-20 order-3 min-w-0">
          <p className="mt-4 max-w-xl text-base text-[var(--fg)]/75 md:mt-0 md:text-lg">{copy.ar.heroSupport}</p>
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
              href={waLink(site.whatsapp.ar, "Hi — I want a B Socio AR demo.")}
            >
              Talk on WhatsApp
            </a>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">{copy.ar.trust}</p>
        </div>
      </div>
    </section>
  );
}
