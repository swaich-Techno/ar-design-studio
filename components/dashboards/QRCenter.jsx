"use client";

import { useEffect, useState } from "react";
import { QRCard } from "@/components/qr/QRCard";

export function QRCenter() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/qrs").then((res) => res.json()).then(setData);
  }, []);

  if (!data) return <p className="font-bold text-slate-600">Loading QR center...</p>;

  return (
    <div className="grid gap-8">
      <div className="rounded-[26px] border border-orange-200 bg-orange-50 p-5 text-sm font-bold leading-7 text-orange-800">
        Public QR links must open without login. On Vercel, keep Deployment Protection off for production public QR pages, otherwise customers may see a Vercel login screen after scanning.
      </div>
      <section>
        <h2 className="mb-4 text-xl font-black">Catalogue QR</h2>
        <QRCard item={data.catalogue} />
      </section>
      {[
        ["Product QR codes", data.products],
        ["Table QR codes", data.tables],
        ["Campaign QR codes", data.campaigns]
      ].map(([title, items]) => (
        <section key={title}>
          <h2 className="mb-4 text-xl font-black">{title}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {items?.length ? items.map((item) => <QRCard key={String(item.id || item.publicUrl)} item={item} />) : <div className="rounded-[26px] border border-dashed p-6 font-semibold text-slate-500">No QR codes yet.</div>}
          </div>
        </section>
      ))}
    </div>
  );
}
