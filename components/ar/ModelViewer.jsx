"use client";

import Script from "next/script";
import { BadgeCheck, ExternalLink, Rotate3D, ScanLine } from "lucide-react";
import { trackPublicEvent } from "@/components/public/PublicTracker";
import { RotatingProductPreview } from "@/components/public/RotatingProductPreview";

export function ModelViewer({ product, trackingPayload }) {
  if (!product.modelGlbUrl) {
    return <RotatingProductPreview product={product} />;
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Interactive product view</p>
          <h2 className="mt-1 text-xl font-black text-ink">Rotate, zoom, and launch AR</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-black text-teal-800">
          <BadgeCheck size={15} /> AR-ready model
        </span>
      </div>
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" strategy="afterInteractive" />
      <model-viewer
        src={product.modelGlbUrl}
        ios-src={product.modelUsdzUrl || undefined}
        poster={product.imageUrl || undefined}
        alt={product.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style={{ width: "100%", height: "460px", background: "radial-gradient(circle at top, #ecfeff, #f8fafc 58%, #e2e8f0)" }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white shadow-lg"
          onClick={() => trackPublicEvent({ ...trackingPayload, eventType: "ar_view" })}
        >
          <ScanLine size={18} /> View in your space
        </button>
      </model-viewer>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs font-bold text-slate-600">
        <span className="inline-flex items-center gap-2"><Rotate3D size={15} /> Drag to rotate. Pinch or scroll to zoom.</span>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")} className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Open browser</button>
          <a href={product.modelGlbUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Model</a>
        </div>
      </div>
    </div>
  );
}
