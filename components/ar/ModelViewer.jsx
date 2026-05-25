"use client";

import Script from "next/script";
import { ExternalLink } from "lucide-react";
import { trackPublicEvent } from "@/components/public/PublicTracker";
import { RotatingProductPreview } from "@/components/public/RotatingProductPreview";

export function ModelViewer({ product, trackingPayload }) {
  if (!product.modelGlbUrl) {
    return <RotatingProductPreview product={product} />;
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
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
        style={{ width: "100%", height: "420px", background: "#f8fafc" }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 left-4 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white shadow-lg"
          onClick={() => trackPublicEvent({ ...trackingPayload, eventType: "ar_view" })}
        >
          View in AR
        </button>
      </model-viewer>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs font-bold text-slate-600">
        <span>3D rotate, zoom, and AR-ready on supported HTTPS mobile browsers.</span>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")} className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Open browser</button>
          <a href={product.modelGlbUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Model</a>
        </div>
      </div>
    </div>
  );
}
