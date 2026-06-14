"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const statusClass = {
  REQUESTED: "bg-amber-50 text-amber-800",
  APPROVED: "bg-teal-50 text-teal-800",
  REJECTED: "bg-red-50 text-red-700",
  CONVERTED: "bg-slate-100 text-slate-700"
};

export function DemoRequestManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const response = await fetch("/api/demo-requests", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Demo requests could not be loaded.");
      return;
    }
    setRequests(data.requests || []);
  }

  useEffect(() => { load(); }, []);

  async function act(ticket, action) {
    setBusyId(ticket._id);
    setMessage("");
    setError("");
    const response = await fetch("/api/demo-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: ticket._id, action })
    });
    const data = await response.json().catch(() => ({}));
    setBusyId("");
    if (!response.ok) {
      setError(data.error || "Demo request update failed.");
      return;
    }
    if (action === "approve") {
      const passwordLine = data.owner?.temporaryPassword ? ` Temporary password: ${data.owner.temporaryPassword}` : "";
      setMessage(`Approved one-product demo for ${data.business?.businessName || ticket.requesterBusinessName || "client"}.${passwordLine}`);
    } else {
      setMessage("Demo request rejected.");
    }
    load();
  }

  if (loading) return <p className="font-bold text-slate-600">Loading demo requests...</p>;

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Free demo control</p>
            <h2 className="mt-1 text-2xl font-black">Approve one-product client demos</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              Approved requests create or update a trial client workspace with one product slot, one AR/3D slot, and a 14-day demo window.
            </p>
          </div>
          <Button type="button" variant="light" onClick={load}>Refresh</Button>
        </div>
      </section>

      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}

      <div className="grid gap-3">
        {requests.map((ticket) => {
          const business = ticket.demoBusinessId;
          const approved = ticket.demoStatus === "APPROVED" || ticket.demoStatus === "CONVERTED";
          return (
            <article key={ticket._id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black">{ticket.requesterBusinessName || ticket.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass[ticket.demoStatus] || "bg-slate-100 text-slate-700"}`}>{ticket.demoStatus || "REQUESTED"}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {ticket.requesterName || "Unknown"} - {ticket.requesterEmail || "No email"} - {ticket.requesterPhone || "No phone"}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{ticket.requesterIndustry || "Industry not shared"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!approved && ticket.demoStatus !== "REJECTED" ? (
                    <>
                      <button disabled={busyId === ticket._id} onClick={() => act(ticket, "approve")} className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-2 text-sm font-black text-white disabled:opacity-60">
                        <ShieldCheck size={16} /> Approve 1-product demo
                      </button>
                      <button disabled={busyId === ticket._id} onClick={() => act(ticket, "reject")} className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 disabled:opacity-60">
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-3 rounded-3xl bg-slate-50 p-4 md:grid-cols-3">
                <p className="text-sm font-bold text-slate-600"><span className="block text-xs uppercase tracking-[0.12em] text-slate-400">Product slots</span>{ticket.demoProductLimit || 1}</p>
                <p className="text-sm font-bold text-slate-600"><span className="block text-xs uppercase tracking-[0.12em] text-slate-400">AR slots</span>{ticket.demoArProductLimit || 1}</p>
                <p className="text-sm font-bold text-slate-600"><span className="block text-xs uppercase tracking-[0.12em] text-slate-400">Ticket</span>{ticket.status || "OPEN"}</p>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-2xl bg-white text-sm font-semibold leading-6 text-slate-600">{ticket.description}</p>

              {business ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">
                  <BadgeCheck size={17} /> Demo workspace: {business.businessName}
                  <a href={`/b/${business.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand">
                    Open public page <ExternalLink size={14} />
                  </a>
                </div>
              ) : null}
            </article>
          );
        })}
        {!requests.length ? <p className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500">No free demo requests yet.</p> : null}
      </div>
    </div>
  );
}
