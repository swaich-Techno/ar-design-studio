"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

const sample = `name,category,price,description,imageUrl,modelGlbUrl
Signature Chair,Furniture,12999,Premium chair with AR preview,https://example.com/chair.jpg,https://example.com/chair.glb
Chocolate Box,Sweets,699,Gift box with product image,https://example.com/box.jpg,`;

export function ProductImportCard({ onImported }) {
  const [csv, setCsv] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "Import failed.");
      return;
    }
    setCsv("");
    setMessage(`${data.imported || 0} products imported and sent for approval.`);
    onImported?.();
  }

  return (
    <form onSubmit={submit} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Import products from CSV</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">Columns: name, category, price, description, imageUrl, modelGlbUrl. Imported items still need approval before public listing.</p>
        </div>
        <Upload className="text-brand" />
      </div>
      <textarea className="field mt-4 min-h-36 font-mono text-xs" value={csv} onChange={(event) => setCsv(event.target.value)} placeholder={sample} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="accent" disabled={loading}>{loading ? "Importing..." : "Import CSV"}</Button>
        <button type="button" className="text-sm font-black text-brand" onClick={() => setCsv(sample)}>Use sample format</button>
      </div>
      {message ? <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">{message}</p> : null}
    </form>
  );
}
