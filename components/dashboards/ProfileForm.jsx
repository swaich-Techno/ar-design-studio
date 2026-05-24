"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

export function ProfileForm() {
  const [business, setBusiness] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/business/profile").then((res) => res.json()).then((data) => setBusiness(data.business || {}));
  }, []);

  function update(key, value) {
    setBusiness((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaved(false);
    const response = await fetch("/api/business/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(business)
    });
    if (response.ok) setSaved(true);
  }

  if (!business) return <p className="font-bold text-slate-600">Loading profile...</p>;

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="field" placeholder="Business name" value={business.businessName || ""} onChange={(e) => update("businessName", e.target.value)} />
        <input className="field" placeholder="Owner name" value={business.ownerName || ""} onChange={(e) => update("ownerName", e.target.value)} />
        <input className="field" placeholder="Phone" value={business.phone || ""} onChange={(e) => update("phone", e.target.value)} />
        <input className="field" placeholder="WhatsApp" value={business.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} />
      </div>
      <ImageUploadField label="Logo" value={business.logoUrl || ""} onChange={(value) => update("logoUrl", value)} folder="ar-design-studio-business" />
      <ImageUploadField label="Cover image" value={business.coverImageUrl || ""} onChange={(value) => update("coverImageUrl", value)} folder="ar-design-studio-business" />
      <input className="field" placeholder="Address" value={business.address || ""} onChange={(e) => update("address", e.target.value)} />
      <input className="field" placeholder="Google Maps link" value={business.mapLink || ""} onChange={(e) => update("mapLink", e.target.value)} />
      <input className="field" placeholder="Instagram link" value={business.instagram || ""} onChange={(e) => update("instagram", e.target.value)} />
      {saved ? <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">Profile saved.</p> : null}
      <Button type="submit" variant="accent">Save profile</Button>
    </form>
  );
}
