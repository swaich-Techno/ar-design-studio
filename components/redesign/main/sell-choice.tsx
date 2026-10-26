"use client";

import Link from "next/link";
import { foodDemo } from "@/lib/redesign/site";

const FOOD = "/redesign/campaigns/food-ar.webp";

export function SellChoice() {
  return (
    <section className="relative z-10 px-5 pb-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker mb-6">Food AR</p>
        <Link href="/ar/food" className="sell-card sell-card--food group">
          <div className="sell-card__dish" aria-hidden>
            <img src={FOOD} alt="" />
          </div>
          <div className="sell-card__plane" aria-hidden />
          <div className="sell-card__copy">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--amber)]">See on My Table</p>
            <h2 className="headline mt-3 text-[clamp(2.6rem,7vw,6rem)]">FOOD AR</h2>
            <p className="mt-3 max-w-lg text-muted">
              See the plate before ordering. Hero dishes, desserts, and drinks — not a 100-item dump.
            </p>
            <p className="sell-card__cta mt-6 text-sm text-[var(--amber)]">Open food AR →</p>
          </div>
        </Link>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {foodDemo.map((item) => (
            <Link
              key={item.slug}
              href={`/ar/demo/${item.slug}`}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-black/35"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="aspect-square w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--amber)]">
                  {item.veg ? "Veg" : "Non-veg"} · DEMO PRICE {item.price}
                </p>
                <p className="mt-2 font-display text-xl">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
