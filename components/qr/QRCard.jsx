"use client";

import { Download, Link as LinkIcon, Printer } from "lucide-react";

export function QRCard({ item }) {
  function download() {
    const a = document.createElement("a");
    a.href = item.qrCodeDataUrl;
    a.download = `${item.label || "qr-code"}.png`;
    a.click();
  }

  async function copy() {
    await navigator.clipboard.writeText(item.publicUrl);
    alert("Public link copied.");
  }

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {item.qrCodeDataUrl ? <img src={item.qrCodeDataUrl} alt={item.label} className="h-28 w-28 rounded-2xl border bg-white" /> : <div className="grid h-28 w-28 place-items-center rounded-2xl bg-slate-100 text-xs font-bold">QR pending</div>}
        <div className="min-w-0 flex-1">
          <p className="font-black">{item.label}</p>
          <p className="mt-1 break-all text-xs font-semibold text-slate-500">{item.publicUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={download} className="inline-flex items-center gap-2 rounded-2xl bg-ink px-3 py-2 text-xs font-bold text-white"><Download size={14} /> PNG</button>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold"><LinkIcon size={14} /> Copy</button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold"><Printer size={14} /> Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}
