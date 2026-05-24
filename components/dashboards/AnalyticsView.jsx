"use client";

import { useEffect, useState } from "react";
import { StatGrid } from "@/components/dashboards/StatGrid";

export function AnalyticsView({ staffMode = false }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard").then((res) => res.json()).then(setData);
  }, []);

  if (!data) return <p className="font-bold text-slate-600">Loading analytics...</p>;

  const stats = data.stats || {};
  return (
    <div className="grid gap-6">
      <StatGrid items={[
        { label: "Total scans", value: stats.scans || 0 },
        { label: "WhatsApp clicks", value: stats.whatsapp || 0 },
        { label: "AR views", value: stats.arViews || 0 },
        { label: staffMode ? "Products visible" : "Products", value: stats.products || 0 }
      ]} />
      <div className="rounded-[26px] border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">Top products</h2>
        <div className="mt-4 grid gap-3">
          {(data.topProducts || []).map((product) => (
            <div key={product._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-bold">{product.name}</span>
              <span className="text-sm font-black text-brand">{product.views || 0} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
