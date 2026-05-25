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
        <select className="field" multiple value={form.selectedProductIds} onChange={(e) => update("selectedProductIds", Array.from(e.target.selectedOptions).map((option) => option.value))}>
          {products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
        </select>
        <Button type="submit" variant="accent">Create campaign QR</Button>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => <QRCard key={campaign._id} item={{ label: campaign.title, publicUrl: campaign.publicUrl, qrCodeDataUrl: campaign.qrCodeDataUrl }} />)}
      </div>
    </div>
  );
}
