"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatGrid } from "@/components/dashboards/StatGrid";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function ReportsView() {
  const [month, setMonth] = useState(currentMonth());
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const response = await fetch(`/api/reports?month=${encodeURIComponent(month)}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Report could not be loaded.");
      setReport(null);
      return;
    }
    setReport(payload);
  }, [month]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-2xl font-black">Monthly scan and lead report</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Use Print to save as PDF, or export the report as CSV.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input className="field max-w-[180px]" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          <Button type="button" variant="light" onClick={load}><RefreshCw size={16} /> Refresh</Button>
          <a href={`/api/reports?month=${encodeURIComponent(month)}&format=csv`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"><Download size={16} /> CSV</a>
          <Button type="button" variant="accent" onClick={() => window.print()}><Printer size={16} /> Save PDF</Button>
        </div>
      </div>

      {error ? <div className="rounded-[26px] border border-red-200 bg-red-50 p-5 font-bold text-red-700">{error}</div> : null}
      {!report && !error ? <p className="font-bold text-slate-600">Loading report...</p> : null}
      {report ? (
        <div className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">AR Design Studio</p>
            <h1 className="mt-2 text-3xl font-black">Monthly Report - {report.month}</h1>
          </div>
          <StatGrid items={[
            { label: "Total events", value: report.stats.totalEvents },
            { label: "Scans", value: report.stats.scans },
            { label: "WhatsApp leads", value: report.stats.whatsapp },
            { label: "AR views", value: report.stats.arViews }
          ]} />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 p-5">
              <h3 className="text-xl font-black">Top products</h3>
              <div className="mt-4 grid gap-3">
                {(report.topProducts || []).map((product) => (
                  <div key={product._id} className="flex justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
                    <span className="font-bold">{product.name}</span>
                    <span className="font-black text-brand">{product.views || 0} views / {product.whatsappClicks || 0} leads</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 p-5">
              <h3 className="text-xl font-black">Lead summary</h3>
              <div className="mt-4 grid gap-3 text-sm font-bold text-slate-600">
                <p>WhatsApp clicks: {report.stats.whatsapp}</p>
                <p>Call clicks: {report.stats.calls}</p>
                <p>Share clicks: {report.stats.shares}</p>
                <p>AR views: {report.stats.arViews}</p>
              </div>
            </div>
          </div>
          <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-brand print:bg-white">
            This report helps justify recurring subscription value by showing scan activity, sales intent, and AR engagement.
          </p>
        </div>
      ) : null}
    </div>
  );
}
