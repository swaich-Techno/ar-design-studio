"use client";

import { useEffect, useState } from "react";
import { Download, MessageCircle, Phone, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const icons = {
  whatsapp_click: MessageCircle,
  call_click: Phone,
  share_click: Share2
};

function label(eventType) {
  return {
    whatsapp_click: "WhatsApp lead",
    call_click: "Call lead",
    share_click: "Share action"
  }[eventType] || eventType;
}

export function LeadInbox() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const response = await fetch("/api/analytics", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Lead inbox could not be loaded.");
      setData(null);
      return;
    }
    setData(payload);
  }

  useEffect(() => { load(); }, []);

  if (error) return <div className="rounded-[26px] border border-red-200 bg-red-50 p-5 font-bold text-red-700">{error}</div>;
  if (!data) return <p className="font-bold text-slate-600">Loading lead inbox...</p>;

  const leads = data.leadEvents || [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Lead inbox</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">WhatsApp clicks, calls, and shares from public QR pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="light" onClick={load}><RefreshCw size={16} /> Refresh</Button>
          <a href="/api/analytics?format=csv" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"><Download size={16} /> Export leads</a>
        </div>
      </div>

      <div className="grid gap-3">
        {leads.map((lead) => {
          const Icon = icons[lead.eventType] || MessageCircle;
          return (
            <div key={lead._id} className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[44px_1fr_auto] md:items-center">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-brand"><Icon size={20} /></div>
              <div>
                <p className="font-black">{lead.productId?.name || lead.campaignId?.title || (lead.tableId?.tableNumber ? `Table ${lead.tableId.tableNumber}` : "Catalogue lead")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{lead.businessId?.businessName || "Business"} - {label(lead.eventType)} - {lead.device || "device"}</p>
              </div>
              <p className="text-sm font-bold text-slate-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ""}</p>
            </div>
          );
        })}
        {!leads.length ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-lg font-black">No leads yet</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">Leads appear when customers tap WhatsApp, call, or share from public QR pages.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
