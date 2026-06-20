"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import { QRCard } from "@/components/qr/QRCard";

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", offerText: "", bannerImageUrl: "", selectedProductIds: [] });

  async function load() {
    const [campaignRes, productRes] = await Promise.all([fetch("/api/campaigns"), fetch("/api/products")]);
    const campaignData = await campaignRes.json();
    const productData = await productRes.json();
    setCampaigns(campaignData.campaigns || []);
    setProducts(productData.products || []);
  }

  useEffect(() => { load(); }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleProduct(productId) {
    setForm((current) => {
      const selected = current.selectedProductIds || [];
      return {
        ...current,
        selectedProductIds: selected.includes(productId)
          ? selected.filter((id) => id !== productId)
          : [...selected, productId]
      };
    });
  }

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ title: "", description: "", offerText: "", bannerImageUrl: "", selectedProductIds: [] });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <input className="field" placeholder="Campaign title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        <input className="field" placeholder="Offer text" value={form.offerText} onChange={(e) => update("offerText", e.target.value)} />
        <textarea className="field" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
        <ImageUploadField label="Campaign banner" value={form.bannerImageUrl} onChange={(value) => update("bannerImageUrl", value)} folder="ar-design-studio-campaigns" />
        <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-black">Select products for this campaign</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Only selected products will appear on the public campaign QR page.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand">{form.selectedProductIds.length} selected</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const selected = form.selectedProductIds.includes(product._id);
              return (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => toggleProduct(product._id)}
                  className={`grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                    {product.imageUrl ? <img src={product.imageUrl} alt={`${product.name} campaign product`} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black">{product.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{product.category || "General"} - Rs. {product.discountPrice || product.price || 0}</p>
                  </div>
                  <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs font-black ${selected ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white text-slate-400"}`}>{selected ? "Y" : ""}</span>
                </button>
              );
            })}
            {!products.length ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm font-bold text-slate-500">No products available yet.</p> : null}
          </div>
        </div>
        <Button type="submit" variant="accent">Create campaign QR</Button>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => <QRCard key={campaign._id} item={{ label: campaign.title, publicUrl: campaign.publicUrl, qrCodeDataUrl: campaign.qrCodeDataUrl }} />)}
      </div>
    </div>
  );
}
