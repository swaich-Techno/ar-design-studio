"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function SupportManager() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM" });

  async function load() {
    const response = await fetch("/api/support");
    const data = await response.json();
    setTickets(data.tickets || []);
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", description: "", priority: "MEDIUM" });
    load();
  }

  async function setStatus(ticket, status) {
    await fetch(`/api/support/${ticket._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">Create support ticket</h2>
        <input className="field" placeholder="Issue title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <Button type="submit" variant="accent">Create ticket</Button>
      </form>
      <div className="grid gap-3">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black">{ticket.title}</p>
                <p className="text-sm font-semibold text-slate-500">{ticket.businessId?.businessName || "Internal"} - {ticket.priority}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                  <button key={status} onClick={() => setStatus(ticket, status)} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold">{status}</button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{ticket.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
