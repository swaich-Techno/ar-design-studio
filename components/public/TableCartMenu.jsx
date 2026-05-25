"use client";

import Link from "next/link";
import { Minus, Plus, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { trackPublicEvent } from "@/components/public/PublicTracker";

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function TableCartMenu({ business, table, products }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category || "General"))], [products]);

  const filtered = products.filter((product) => {
    const matchesCategory = category === "All" || (product.category || "General") === category;
    const text = `${product.name} ${product.category} ${product.shortDescription || ""}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  });

  const items = products.filter((product) => cart[product._id]).map((product) => ({ product, qty: cart[product._id] }));
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * Number(item.product.discountPrice || item.product.price || 0), 0);

  function add(product) {
    if (product.stockStatus === "OUT_OF_STOCK") return;
    setCart((current) => ({ ...current, [product._id]: Number(current[product._id] || 0) + 1 }));
  }

  function remove(product) {
    setCart((current) => {
      const next = { ...current };
      const qty = Number(next[product._id] || 0) - 1;
      if (qty <= 0) delete next[product._id];
      else next[product._id] = qty;
      return next;
    });
  }

  function whatsappLink() {
    const lines = items.map((item) => `${item.qty}x ${item.product.name}`).join(", ");
    const message = `Hello, I want to order: ${lines} from ${business.businessName}. Table Number: ${table.tableNumber}. Please confirm availability.`;
    return `https://wa.me/${cleanPhone(business.whatsapp)}?text=${encodeURIComponent(message)}`;
  }

  function trackOrder() {
    trackPublicEvent({ businessSlug: business.slug, tableNumber: table.tableNumber, eventType: "whatsapp_click" });
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-28 pt-8">
      <div className="sticky top-0 z-10 -mx-5 border-b border-slate-200 bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu" className="w-full bg-transparent text-sm font-semibold outline-none" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${category === item ? "bg-ink text-white" : "bg-white text-slate-700"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filtered.map((product) => {
          const image = product.imageUrl || product.stitchedPreviewImageUrl || product.fabricImageUrl;
          const qty = Number(cart[product._id] || 0);
          const price = product.discountPrice || product.price || 0;
          const out = product.stockStatus === "OUT_OF_STOCK";
          return (
            <div key={product._id} className="grid grid-cols-[86px_1fr] gap-4 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
              <Link href={`/b/${business.slug}/product/${product.slug}?table=${encodeURIComponent(table.tableNumber)}`} className="relative h-24 overflow-hidden rounded-2xl bg-slate-100">
                {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : null}
                {product.modelGlbUrl ? <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-[10px] font-black text-white">AR</span> : null}
              </Link>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{product.category || "General"}</p>
                    <Link href={`/b/${business.slug}/product/${product.slug}?table=${encodeURIComponent(table.tableNumber)}`} className="mt-1 block text-lg font-black leading-tight text-ink">{product.name}</Link>
                  </div>
                  <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-black">Rs. {price}</p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription || product.offerText || "Tap to view details."}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${out ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}>{out ? "Out of stock" : product.modelGlbUrl ? "AR ready" : "Image preview"}</span>
                  {qty ? (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => remove(product)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><Minus size={16} /></button>
                      <span className="w-5 text-center font-black">{qty}</span>
                      <button type="button" onClick={() => add(product)} className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white"><Plus size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => add(product)} disabled={out} className="rounded-2xl bg-ink px-4 py-2 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-500">Add</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length ? <p className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center font-bold text-slate-500">No menu items found.</p> : null}
      </div>

      {count ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black">{count} item{count > 1 ? "s" : ""} selected</p>
              <p className="text-xs font-bold text-slate-500">Estimated total Rs. {total}</p>
            </div>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" onClick={trackOrder} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white">
              <ShoppingBag size={18} /> Send order
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
