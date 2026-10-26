"use client";

import { useState } from "react";
import { foodVerticals } from "@/lib/redesign/site";

const MOCK: Record<string, { name: string; price: string; note: string }[]> = {
  restaurant: [
    { name: "Signature Burger", price: "₹480", note: "Hero · 3D/AR" },
    { name: "Table 12 · QR", price: "Enquire", note: "WhatsApp includes table" },
  ],
  cafe: [
    { name: "Berry Mocktail", price: "₹320", note: "Hero drink" },
    { name: "Filter Coffee", price: "₹129", note: "Photo optional" },
  ],
  bakery: [
    { name: "Chocolate Lava", price: "₹450", note: "Hero dessert" },
    { name: "Gulab Jamun", price: "₹159", note: "Name + price" },
  ],
  sweet: [
    { name: "Festival box", price: "Enquire", note: "Catalogue, not 100 3D SKUs" },
    { name: "Chocolate Lava", price: "₹450", note: "One modelled hero" },
  ],
  hotel: [
    { name: "In-room menu", price: "Scan", note: "No guest app" },
    { name: "Signature Burger", price: "₹480", note: "Hero dish" },
  ],
  catering: [
    { name: "Event set", price: "Enquire", note: "Shareable link" },
    { name: "Berry Mocktail", price: "₹320", note: "Hero drink" },
  ],
  cloud: [
    { name: "Packaging QR", price: "Scan", note: "Opens in browser" },
    { name: "Signature Burger", price: "₹480", note: "Few modelled SKUs" },
  ],
  dessert: [
    { name: "Chocolate Lava", price: "₹450", note: "Hero · 3D/AR" },
    { name: "Berry Mocktail", price: "₹320", note: "Hero drink" },
  ],
};

export function SellVerticals() {
  const [active, setActive] = useState<(typeof foodVerticals)[number]["id"]>("restaurant");
  const current = foodVerticals.find((item) => item.id === active) ?? foodVerticals[0];
  const menu = MOCK[current.id];

  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Food businesses</p>
        <h2 className="headline mt-4 max-w-[16ch] text-[clamp(2.2rem,5vw,4.4rem)]">BUILT FOR THE WAY YOU SELL FOOD</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {foodVerticals.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`min-h-11 rounded-full border px-4 text-sm ${
                current.id === item.id
                  ? "border-[var(--amber)] bg-[var(--burgundy)] text-[var(--cream)]"
                  : "border-white/12 text-[var(--fg)]/80"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <p className="max-w-xl text-lg text-[var(--fg)]/75">{current.body}</p>
          <div className="rounded-[28px] border border-white/10 bg-[#101114] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Mock menu · {current.title}</p>
            <ul className="mt-4 space-y-3">
              {menu.map((row) => (
                <li key={row.name} className="flex items-baseline justify-between gap-3 border-b border-white/8 pb-3">
                  <div>
                    <p className="font-display text-xl">{row.name}</p>
                    <p className="text-xs text-muted">{row.note}</p>
                  </div>
                  <p className="text-[var(--amber)]">{row.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
