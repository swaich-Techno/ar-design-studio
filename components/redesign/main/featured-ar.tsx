"use client";

import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { useScanNav } from "@/components/redesign/chrome/scan-overlay";
import { ArBeatCaption } from "@/components/redesign/ar/beat-caption";
import { ArHeroLoop } from "@/components/redesign/ar/hero-loop";

export function FeaturedAr() {
  const scan = useScanNav();
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-5 py-24 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)] md:px-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,40%)]">
        <div className="relative z-20 min-w-0">
          <p className="kicker">Introducing</p>
          <h2 className="headline mt-4 max-w-[10ch] text-[clamp(2.8rem,8vw,6.4rem)] text-[#f3efe6]">
            B SOCIO AR
          </h2>
          <p className="mt-5 max-w-md font-serif text-2xl italic text-[var(--fg)]/75">
            Turn products into experiences.
          </p>
          <p className="mt-4 max-w-md text-sm text-muted">
            Point a phone at a table. Hero dishes lock onto the surface, then guests inspect and
            enquire — in the browser, no app.
          </p>
          <Magnetic className="mt-8">
            <Button size="lg" variant="accent" onClick={() => scan.go("/ar")}>
              Enter B Socio AR →
            </Button>
          </Magnetic>
          <Link href="/ar" className="sr-only">
            Enter B Socio AR
          </Link>
        </div>
        <div className="relative z-10 min-w-0">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-[480px] md:mx-0 md:aspect-auto md:h-[min(52vh,440px)] md:max-w-none">
            <ArHeroLoop kind="food" />
          </div>
          <ArBeatCaption className="mt-4" />
        </div>
      </div>
    </section>
  );
}
