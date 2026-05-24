"use client";

import Script from "next/script";
import { Box, ExternalLink } from "lucide-react";
import { trackPublicEvent } from "@/components/public/PublicTracker";

export function ModelViewer({ product, trackingPayload }) {
  if (!product.modelGlbUrl) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-80 w-full object-cover" /> : null}
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Box className="text-brand" />
            <p className="font-black">3D/AR model coming soon</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">This product has no GLB model URL yet. Add a real .glb file in the business dashboard to enable 3D and AR viewing.</p>
        </div>
      </div>
    );
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
      <div className="flex items-center justify-between gap-3 p-4 text-xs font-bold text-slate-600">
        <span>3D rotate, zoom, and AR-ready on supported HTTPS mobile browsers.</span>
        <a href={product.modelGlbUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Model</a>
      </div>
    </div>
  );
}
