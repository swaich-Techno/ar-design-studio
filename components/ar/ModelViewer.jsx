"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ExternalLink, Rotate3D, ScanLine } from "lucide-react";
import { trackPublicEvent } from "@/components/public/PublicTracker";
import { RotatingProductPreview } from "@/components/public/RotatingProductPreview";

export function ModelViewer({ product, trackingPayload = {} }) {
  const viewerRef = useRef(null);
  const [arMessage, setArMessage] = useState("");
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const hasGlb = Boolean(product.modelGlbUrl);
  const hasUsdz = Boolean(product.modelUsdzUrl);

  useEffect(() => {
    if (!hasGlb) return;
    let mounted = true;
    import("@google/model-viewer")
      .then(() => {
        if (mounted) setViewerLoaded(true);
      })
      .catch(() => {
        if (mounted) setArMessage("3D viewer could not load. You can still open the model file directly.");
      });
    return () => {
      mounted = false;
    };
  }, [hasGlb]);

  function trackArIntent() {
    trackPublicEvent({ ...trackingPayload, eventType: "ar_view" });
  }

  async function launchAR() {
    trackArIntent();
    const viewer = viewerRef.current;
    if (viewer && typeof viewer.activateAR === "function") {
      try {
        await viewer.activateAR();
        return;
      } catch {
        setArMessage("Use the View in your space button inside the 3D viewer if your browser blocks automatic AR launch.");
      }
    } else {
      setArMessage("Your browser can still rotate the 3D product here. Camera AR needs a supported mobile browser.");
    }
  }

  if (!hasGlb) {
    return (
      <div id="product-ar-viewer" className="grid gap-4">
        <RotatingProductPreview product={product} />
        {hasUsdz ? (
          <div className="rounded-[24px] border border-teal-200 bg-teal-50 p-4 text-sm font-bold leading-6 text-teal-900">
            <p className="font-black">iPhone AR file is available.</p>
            <p className="mt-1">Add a GLB file to unlock full web 3D rotation. iPhone and iPad users can open the USDZ preview below.</p>
            <a
              rel="ar"
              href={product.modelUsdzUrl}
              onClick={trackArIntent}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white"
            >
              <ScanLine size={17} /> Open iPhone AR preview
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div id="product-ar-viewer" className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Interactive product view</p>
          <h2 className="mt-1 text-xl font-black text-ink">Rotate, zoom, and launch AR</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-black text-teal-800">
          <BadgeCheck size={15} /> AR-ready model
        </span>
      </div>
      <div className="relative min-h-[360px] bg-slate-50">
        {!viewerLoaded ? (
          <div className="absolute inset-0 z-10 grid place-items-center px-5 text-center">
            <p className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm">Loading 3D viewer...</p>
          </div>
        ) : null}
        <model-viewer
          ref={viewerRef}
          src={product.modelGlbUrl}
          ios-src={product.modelUsdzUrl || undefined}
          poster={product.imageUrl || undefined}
          alt={product.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="auto"
          camera-controls
          auto-rotate
          loading="lazy"
          reveal="interaction"
          interaction-prompt="auto"
          bounds="tight"
          shadow-intensity="1"
          exposure="1"
          touch-action="pan-y"
          camera-orbit="0deg 70deg 105%"
          min-camera-orbit="auto auto 70%"
          max-camera-orbit="auto auto 180%"
          style={{ width: "100%", height: "460px", background: "radial-gradient(circle at top, #ecfeff, #f8fafc 58%, #e2e8f0)" }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-black text-white shadow-lg"
            onClick={trackArIntent}
          >
            <ScanLine size={18} /> View in your space
          </button>
        </model-viewer>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs font-bold text-slate-600">
        <span className="inline-flex items-center gap-2"><Rotate3D size={15} /> Drag to rotate. Pinch or scroll to zoom.</span>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={launchAR} className="flex items-center gap-1 text-brand"><ScanLine size={14} /> Start AR</button>
          <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")} className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Open browser</button>
          <a href={product.modelGlbUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand"><ExternalLink size={14} /> Model</a>
        </div>
      </div>
      {arMessage ? <p className="border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500">{arMessage}</p> : null}
    </div>
  );
}
