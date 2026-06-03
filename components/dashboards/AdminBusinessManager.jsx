"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UsageBar } from "@/components/dashboards/UsageBar";

const PLAN_OPTIONS = ["Starter", "Growth", "Premium", "Enterprise"];
const STATUS_OPTIONS = ["ACTIVE", "TRIAL", "INACTIVE", "EXPIRED", "PAST_DUE", "FROZEN"];
const LIMIT_FIELDS = [
  ["productLimit", "Products"],
  ["staffLimit", "Staff"],
  ["storageLimitMB", "Storage MB"],
  ["arProductLimit", "AR products"],
  ["usedStorageMB", "Used storage MB"]
];

export function AdminBusinessManager() {
  const [businesses, setBusinesses] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    const response = await fetch("/api/admin/businesses", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Businesses could not be loaded.");
      return;
    }
    setBusinesses(data.businesses || []);
  }

  useEffect(() => { load(); }, []);

  function setDraftField(id, field, value) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value }
    }));
  }

  function getDraftValue(business, field) {
    return drafts[business._id]?.[field] ?? business[field] ?? "";
  }

  function buildPatch(business) {
    const draft = drafts[business._id] || {};
    const patch = {};
    for (const [field] of LIMIT_FIELDS) {
      if (draft[field] !== undefined && Number(draft[field]) !== Number(business[field] || 0)) patch[field] = Number(draft[field] || 0);
    }
    for (const field of ["subscriptionPlan", "subscriptionStatus"]) {
      if (draft[field] !== undefined && draft[field] !== business[field]) patch[field] = draft[field];
    }
    return patch;
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Business could not be created.");
      return;
    }
    setMessage("Business owner account created.");
    setForm({ businessName: "", ownerName: "", email: "", password: "", whatsapp: "", category: "Local shops", subscriptionPlan: "Starter" });
    load();
  }

  async function updateBusiness(business, extraPatch = null) {
    const patch = extraPatch || buildPatch(business);
    if (!Object.keys(patch).length) {
      setMessage("No changes to save for this client.");
      return;
    }
    setBusyId(business._id);
    setMessage("");
    setError("");
    const response = await fetch(`/api/admin/businesses/${business._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    const data = await response.json().catch(() => ({}));
    setBusyId("");
    if (!response.ok) {
      setError(data.error || "Client update failed.");
      return;
    }
    setDrafts((current) => {
      const next = { ...current };
      delete next[business._id];
      return next;
    });
    setMessage("Client updated successfully.");
    load();
  }

  async function toggle(business) {
    await updateBusiness(business, { isActive: !business.isActive });
  }

  async function freeze(business) {
    await updateBusiness(business, { isActive: false, subscriptionStatus: "FROZEN", isFrozenForNonPayment: true });
  }

  async function removeBusiness(business) {
    const confirmed = window.confirm(`Delete "${business.businessName}" permanently? This removes the business, owner/staff users, products, QR pages, analytics, tickets, and payment records for this client.`);
    if (!confirmed) return;
    setBusyId(business._id);
    setMessage("");
    setError("");
    const response = await fetch(`/api/admin/businesses/${business._id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    setBusyId("");
    if (!response.ok) {
      setError(data.error || "Client could not be deleted.");
      return;
    }
    setMessage("Client removed permanently.");
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-xl font-black">Create client account</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Super admin can create the business, owner login, plan, and starter limits from here.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {["businessName", "ownerName", "email", "password", "whatsapp", "category"].map((key) => (
            <input key={key} className="field" type={key === "password" ? "password" : "text"} placeholder={key} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={["businessName", "ownerName", "email", "password"].includes(key)} />
          ))}
          <select className="field" value={form.subscriptionPlan} onChange={(event) => setForm({ ...form, subscriptionPlan: event.target.value })}>
            {PLAN_OPTIONS.map((plan) => <option key={plan}>{plan}</option>)}
          </select>
        </div>
        <Button type="submit" variant="accent">Create business owner</Button>
      </form>

      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}

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
                  <p className="mt-1 text-xs font-black text-brand">{business.subscriptionPlan} - {business.subscriptionStatus} - {business.isActive ? "Public catalogue active" : "Public catalogue hidden"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button disabled={busyId === business._id} onClick={() => toggle(business)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold disabled:opacity-60">{business.isActive ? "Deactivate" : "Activate"}</button>
                  <button disabled={busyId === business._id} onClick={() => freeze(business)} className="rounded-2xl bg-orange-50 px-4 py-2 text-sm font-black text-orange-700 disabled:opacity-60">Freeze</button>
                  <button disabled={busyId === business._id} onClick={() => removeBusiness(business)} className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 disabled:opacity-60">Delete client</button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <UsageBar label="Storage" used={Math.round(Number(business.usedStorageMB || 0) * 100) / 100} limit={business.storageLimitMB || 0} unit=" MB" />
                <UsageBar label="AR products" used={business.arProductCount || 0} limit={business.arProductLimit || 0} zeroLabel="Not included" />
                <UsageBar label="Products" used={business.productCount || 0} limit={business.productLimit || 0} />
              </div>

              <div className="mt-4 grid gap-3 rounded-3xl bg-slate-50 p-4 md:grid-cols-4">
                <select className="field bg-white" value={getDraftValue(business, "subscriptionPlan")} onChange={(event) => setDraftField(business._id, "subscriptionPlan", event.target.value)}>
                  {PLAN_OPTIONS.map((plan) => <option key={plan}>{plan}</option>)}
                </select>
                <select className="field bg-white" value={getDraftValue(business, "subscriptionStatus")} onChange={(event) => setDraftField(business._id, "subscriptionStatus", event.target.value)}>
                  {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                </select>
                {LIMIT_FIELDS.map(([field, label]) => (
                  <label key={field} className="grid gap-1 text-xs font-black text-slate-500">
                    {label}
                    <input className="field bg-white" type="number" min="0" value={getDraftValue(business, field)} onChange={(event) => setDraftField(business._id, field, event.target.value)} />
                  </label>
                ))}
                <Button type="button" variant="accent" className="md:col-span-2" disabled={busyId === business._id} onClick={() => updateBusiness(business)}>
                  {busyId === business._id ? "Saving..." : "Save plan and limits"}
                </Button>
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
