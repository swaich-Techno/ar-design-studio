"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { Button } from "@/components/ui/Button";

const labels = {
  catalogue_view: "Catalogue view",
  product_view: "Product view",
  ar_view: "AR view",
  whatsapp_click: "WhatsApp click",
  call_click: "Call click",
  location_click: "Location click",
  share_click: "Share click",
  table_scan: "Table scan",
  campaign_view: "Campaign view"
};

function eventName(eventType) {
  return labels[eventType] || eventType;
}

export function AnalyticsView({ staffMode = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    setError("");
    const response = await fetch("/api/analytics", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    setRefreshing(false);
    if (!response.ok) {
      setError(payload.error || "Analytics could not be loaded.");
      setData(null);
      return;
    }
    setData(payload);
  }

  useEffect(() => { load(); }, []);

  const stats = data?.stats || {};
  const leadEvents = data?.leadEvents || [];
  const recentEvents = data?.events || [];
  const topProducts = data?.topProducts || [];

  const eventRows = recentEvents.slice(0, 40);

  if (error) {
    return (
      <div className="rounded-[26px] border border-red-200 bg-red-50 p-5">
        <h2 className="text-xl font-black text-red-800">Analytics unavailable</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-red-700">{error}</p>
        <Button type="button" variant="light" className="mt-4" onClick={load}>Try again</Button>
      </div>
    );
  }

  if (!data) return <p className="font-bold text-slate-600">Loading analytics...</p>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Leads and scan analytics</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Tracks public QR scans, product views, AR views, WhatsApp clicks, calls, and shares.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="light" onClick={load} disabled={refreshing}><RefreshCw size={16} /> {refreshing ? "Refreshing" : "Refresh"}</Button>
          <a href="/api/analytics?format=csv" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white">
            <Download size={16} /> Export CSV
          </a>
        </div>
      </div>

      <StatGrid items={[
        { label: "Total scans", value: stats.scans || 0 },
        { label: "WhatsApp leads", value: stats.whatsapp || 0 },
        { label: "AR views", value: stats.arViews || 0 },
        { label: staffMode ? "Lead actions" : "Calls + shares", value: staffMode ? stats.leads || 0 : Number(stats.calls || 0) + Number(stats.shares || 0) }
      ]} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-5">
          <h3 className="text-xl font-black">Recent leads</h3>
          <div className="mt-4 grid gap-3">
            {leadEvents.slice(0, 12).length ? leadEvents.slice(0, 12).map((event) => (
              <div key={event._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{event.productId?.name || event.campaignId?.title || event.businessId?.businessName || "Public page"}</p>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">{eventName(event.eventType)}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-500">{event.businessId?.businessName || "Business"} - {event.device || "device"} - {event.createdAt ? new Date(event.createdAt).toLocaleString() : ""}</p>
              </div>
            )) : (
              <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-500">No lead activity yet. WhatsApp, call, and share clicks will appear here.</p>
            )}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-5">
          <h3 className="text-xl font-black">Top products</h3>
          <div className="mt-4 grid gap-3">
            {topProducts.length ? topProducts.map((product) => (
              <div key={product._id} className="grid gap-2 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <span className="font-bold">{product.name}</span>
                <span className="text-sm font-black text-brand">{product.whatsappClicks || 0} WhatsApp - {product.arViews || 0} AR - {product.views || 0} views</span>
              </div>
            )) : (
              <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-500">No product analytics yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-xl font-black">Event log</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">Latest public customer activity. Public users never see this data.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Product / page</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {eventRows.map((event) => (
                <tr key={event._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-bold">{event.businessId?.businessName || "-"}</td>
                  <td className="px-4 py-3">{event.productId?.name || event.campaignId?.title || (event.tableId?.tableNumber ? `Table ${event.tableId.tableNumber}` : "Catalogue")}</td>
                  <td className="px-4 py-3">{eventName(event.eventType)}</td>
                  <td className="px-4 py-3">{event.device || "-"}</td>
                  <td className="px-4 py-3">{event.createdAt ? new Date(event.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {!eventRows.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center font-bold text-slate-500">No analytics events yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
