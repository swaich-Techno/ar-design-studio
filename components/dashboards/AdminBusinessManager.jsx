"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UsageBar } from "@/components/dashboards/UsageBar";

export function AdminBusinessManager() {
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    whatsapp: "",
    category: "Local shops",
    subscriptionPlan: "Starter"
  });

  async function load() {
    const response = await fetch("/api/admin/businesses");
    const data = await response.json();
    setBusinesses(data.businesses || []);
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/admin/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ businessName: "", ownerName: "", email: "", password: "", whatsapp: "", category: "Local shops", subscriptionPlan: "Starter" });
    load();
  }

  async function toggle(business) {
    await fetch(`/api/admin/businesses/${business._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !business.isActive })
    });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {["businessName", "ownerName", "email", "password", "whatsapp", "category"].map((key) => (
            <input key={key} className="field" type={key === "password" ? "password" : "text"} placeholder={key} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={["businessName", "ownerName", "email", "password"].includes(key)} />
          ))}
          <select className="field" value={form.subscriptionPlan} onChange={(event) => setForm({ ...form, subscriptionPlan: event.target.value })}>
            <option>Starter</option>
            <option>Growth</option>
            <option>Premium</option>
          </select>
        </div>
        <Button type="submit" variant="accent">Create business owner</Button>
      </form>
      <div className="grid gap-3">
        {businesses.map((business) => {
          const storageWarning = Number(business.usedStorageMB || 0) >= Number(business.storageLimitMB || 1) * 0.8;
          const arLimit = Number(business.arProductLimit || 0);
          const arWarning = arLimit > 0 && Number(business.arProductCount || 0) >= arLimit * 0.8;
          return (
            <div key={business._id} className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black">{business.businessName}</p>
                  <p className="text-sm font-semibold text-slate-500">{business.email} - /b/{business.slug}</p>
                  <p className="mt-1 text-xs font-black text-brand">{business.subscriptionPlan} - {business.subscriptionStatus}</p>
                </div>
                <button onClick={() => toggle(business)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">{business.isActive ? "Deactivate" : "Activate"}</button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <UsageBar label="Storage" used={Math.round(Number(business.usedStorageMB || 0) * 100) / 100} limit={business.storageLimitMB || 0} unit=" MB" />
                <UsageBar label="AR products" used={business.arProductCount || 0} limit={business.arProductLimit || 0} zeroLabel="Not included" />
                <UsageBar label="Products" used={business.productCount || 0} limit={business.productLimit || 0} />
              </div>
              {storageWarning || arWarning ? (
                <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">Usage warning: storage or AR product limit is close to full. Offer an add-on or upgrade.</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
