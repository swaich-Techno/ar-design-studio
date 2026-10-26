"use client";

import { useMemo, useState } from "react";
import { FoodTableAr } from "@/components/redesign/ar/food-table-ar";
import { PhotoInspect } from "@/components/redesign/ar/photo-inspect";
import { RealQr } from "@/components/redesign/ar/real-qr";
import { Button } from "@/components/redesign/ui/button";
import { trackPublicEvent } from "@/components/public/PublicTracker";
import {
  demoMenu,
  demoRestaurant,
  foodDemo,
  site,
  waLink,
  type DemoMenuItem,
  type MenuCategory,
} from "@/lib/redesign/site";

const CATEGORIES: MenuCategory[] = ["STARTERS", "MAIN COURSE", "DESSERTS", "DRINKS"];

function enquireLink(item: DemoMenuItem) {
  return waLink(
    site.whatsapp.ar,
    `${demoRestaurant.whatsappPrefill} Dish: ${item.name} (${item.price}). Category: ${item.category}.`,
  );
}

export function DemoRestaurant() {
  const [category, setCategory] = useState<MenuCategory | "ALL">("ALL");
  const [active, setActive] = useState<string>(foodDemo[0].slug);
  const [table, setTable] = useState(false);

  const items = useMemo(
    () => (category === "ALL" ? demoMenu : demoMenu.filter((item) => item.category === category)),
    [category],
  );
  const current = demoMenu.find((item) => item.slug === active) ?? demoMenu.find((item) => item.hero) ?? demoMenu[0];
  const heroProduct = foodDemo.find((item) => item.slug === current.slug);

  function pick(item: DemoMenuItem) {
    setActive(item.slug);
    trackPublicEvent({ businessSlug: "b-socio-demo-restaurant", productSlug: item.slug, eventType: "product_view" });
  }

  return (
    <section className="space-y-12 px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center gap-3">
          <p className="kicker">{demoRestaurant.name}</p>
          <span className="rounded-full border border-[var(--amber)]/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--amber)]">
            {demoRestaurant.badge}
          </span>
        </div>
        <h1 className="headline mt-4 max-w-[16ch] text-[clamp(2.6rem,7vw,5.6rem)]">A menu guests can scan, explore, and enquire from.</h1>
        <p className="mt-5 max-w-xl text-muted">{demoRestaurant.note} Three hero dishes have real photographs and 3D/AR. Other items are name, price, and description only — no generated food photos.</p>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm ${category === "ALL" ? "border-[var(--amber)] text-[var(--cream)]" : "border-white/12"}`}
              onClick={() => setCategory("ALL")}
            >
              All
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`min-h-11 shrink-0 rounded-full border px-4 text-sm ${category === item ? "border-[var(--amber)] text-[var(--cream)]" : "border-white/12"}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {current.hero && heroProduct && table ? (
            <div className="fixed inset-0 z-[70]">
              <FoodTableAr
                product={heroProduct}
                catalog={foodDemo}
                onSelect={(slug) => {
                  const match = demoMenu.find((item) => item.slug === slug);
                  if (match) pick(match);
                }}
                autoLaunch
                onClose={() => setTable(false)}
              />
            </div>
          ) : current.hero && current.image ? (
            <div className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#16090c]">
              <PhotoInspect src={current.image} alt={current.name} className="h-[min(72vw,440px)]" />
            </div>
          ) : (
            <div className="mt-6 grid min-h-[240px] place-items-center rounded-[32px] border border-dashed border-white/15 bg-[#101114] text-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Image unavailable</p>
                <p className="mt-2 font-display text-3xl">{current.name}</p>
                <p className="mt-2 text-[var(--amber)]">{current.price}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {current.veg ? "Veg" : "Non-veg"} · {current.category}
              {current.hero ? " · Hero 3D/AR" : ""}
            </p>
            <h2 className="mt-2 font-display text-4xl">{current.name}</h2>
            <p className="mt-2 max-w-xl text-muted">{current.description}</p>
            <p className="mt-3 text-[var(--amber)]">DEMO PRICE {current.price}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {current.hero ? (
                <>
                  <Button type="button" variant="gold" className="min-h-12" onClick={() => {
                    trackPublicEvent({ businessSlug: "b-socio-demo-restaurant", productSlug: current.slug, eventType: "ar_view" });
                    setTable(true);
                  }}>
                    Place on table
                  </Button>
                  <Button asChild variant="ghost">
                    <a href={`/ar/demo/${current.slug}`}>View in 3D</a>
                  </Button>
                </>
              ) : null}
              <Button asChild variant={current.hero ? "ghost" : "gold"}>
                <a
                  href={enquireLink(current)}
                  onClick={() => trackPublicEvent({ businessSlug: "b-socio-demo-restaurant", productSlug: current.slug, eventType: "whatsapp_click" })}
                >
                  Enquire on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => pick(item)}
                  className={`flex min-h-11 w-full items-center gap-4 rounded-2xl border p-4 text-left ${
                    current.slug === item.slug ? "border-[var(--amber)] bg-white/5" : "border-white/10"
                  }`}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-white/15 text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                      No image
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg">{item.name}</span>
                    <span className="block text-xs text-muted">
                      {item.hero ? "Hero · 3D/AR" : "Name + price"} · {item.price}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <aside>
          <div className="sticky top-28 rounded-[28px] border border-white/10 p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Scan on your phone</p>
            <RealQr path="/ar/demo" label="Real QR to this DEMO restaurant menu." />
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              Desktop preview. Open the same URL on a phone for camera AR.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
