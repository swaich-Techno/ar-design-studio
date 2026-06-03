"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const roles = ["TEAM_ADMIN", "FINANCE_MANAGER", "AR_MANAGER", "SUPPORT_STAFF"];

export function TeamManager() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "SUPPORT_STAFF", department: "", salaryAmount: "" });

  async function load() {
    const response = await fetch("/api/team");
    const data = await response.json();
    setTeam(data.team || []);
  }

  useEffect(() => { load(); }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", email: "", password: "", role: "SUPPORT_STAFF", department: "", salaryAmount: "" });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="field" placeholder="Team member name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
          <select className="field" value={form.role} onChange={(e) => update("role", e.target.value)}>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
          <input className="field" placeholder="Department" value={form.department} onChange={(e) => update("department", e.target.value)} />
          <input className="field" type="number" placeholder="Monthly salary" value={form.salaryAmount} onChange={(e) => update("salaryAmount", e.target.value)} />
        </div>
        <Button type="submit" variant="accent">Create team login</Button>
      </form>
      <div className="grid gap-3">
        {team.map((member) => (
          <div key={member._id} className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black">{member.name}</p>
                <p className="text-sm font-semibold text-slate-500">{member.email} - {member.role}</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold">{member.isActive ? "Active" : "Inactive"}</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-500">{member.department || "No department"} - Salary Rs. {member.salaryAmount || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
