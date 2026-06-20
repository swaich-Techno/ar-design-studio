"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUSINESS_MANAGER", permissions: { canEditProducts: true, canViewLeads: true, canDownloadQR: true, canEditAvailability: true } });

  async function load() {
    const response = await fetch("/api/staff");
    const data = await response.json();
    setStaff(data.staff || []);
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", email: "", password: "", role: "BUSINESS_MANAGER", permissions: { canEditProducts: true, canViewLeads: true, canDownloadQR: true, canEditAvailability: true } });
    load();
  }

  function permission(key, value) {
    setForm((current) => ({ ...current, permissions: { ...current.permissions, [key]: value } }));
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-xl font-black">Create client manager login</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Client employees now use Business login. The Staff login is reserved for AR Design Studio internal team members only.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input className="field" placeholder="Manager name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" type="email" placeholder="Manager email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(form.permissions).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={value} onChange={(e) => permission(key, e.target.checked)} /> {key}</label>
          ))}
        </div>
        <Button type="submit" variant="accent">Create client manager</Button>
      </form>
      <div className="grid gap-3">
        {staff.map((member) => (
          <div key={member._id} className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="font-black">{member.name}</p>
            <p className="text-sm font-semibold text-slate-500">{member.email} - {member.isActive ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
