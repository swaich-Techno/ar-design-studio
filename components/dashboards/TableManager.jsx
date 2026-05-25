"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRCard } from "@/components/qr/QRCard";

export function TableManager() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: "", tableName: "" });

  async function load() {
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(data.tables || []);
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ tableNumber: "", tableName: "" });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-3 rounded-[26px] border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_auto]">
        <input className="field" placeholder="Table number" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} required />
        <input className="field" placeholder="Table name optional" value={form.tableName} onChange={(e) => setForm({ ...form, tableName: e.target.value })} />
        <Button type="submit" variant="accent">Create QR</Button>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {tables.map((table) => <QRCard key={table._id} item={{ label: table.tableName || `Table ${table.tableNumber}`, publicUrl: table.publicUrl, qrCodeDataUrl: table.qrCodeDataUrl }} />)}
      </div>
    </div>
  );
}
