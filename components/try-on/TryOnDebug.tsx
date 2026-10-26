"use client";

import { useEffect, useRef } from "react";
import type { EngineSnapshot } from "@/lib/try-on/engine";
import type { DebugMode, TryOnProduct, ViewportMap } from "@/lib/try-on/types";
import { coverMap } from "@/lib/try-on/utils/transforms";

function worldToCanvas(
  p: { x: number; y: number; z: number },
  viewport: ViewportMap,
) {
  const aspect = viewport.canvasWidth / Math.max(viewport.canvasHeight, 1);
  const tanY = Math.tan(((viewport.vfovDeg * Math.PI) / 180) / 2);
  const tanX = tanY * aspect;
  const z = Math.max(-p.z, 0.06);
  const ndcX = p.x / (tanX * z);
  const ndcY = p.y / (tanY * z);
  return {
    x: (ndcX + 1) * 0.5 * viewport.canvasWidth,
    y: (1 - ndcY) * 0.5 * viewport.canvasHeight,
  };
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[11rem_1fr] gap-2 font-mono text-[10px] leading-4">
      <span className="text-white/50">{k}</span>
      <span className="break-all text-white/90">{v}</span>
    </div>
  );
}

function Qa({ label, pass, skip }: { label: string; pass: boolean; skip?: boolean }) {
  const mark = skip ? "—" : pass ? "PASS" : "FAIL";
  const color = skip ? "text-white/40" : pass ? "text-emerald-300" : "text-rose-300";
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[10px]">
      <span className="text-white/70">{label}</span>
      <span className={color}>{mark}</span>
    </div>
  );
}

export function TryOnDebug({
  mode,
  snap,
  product,
  video,
  mirrored,
}: {
  mode: DebugMode;
  snap: EngineSnapshot | null;
  product: TryOnProduct;
  video: HTMLVideoElement | null;
  mirrored: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === "off") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const vw = video?.videoWidth ?? 0;
    const vh = video?.videoHeight ?? 0;
    if (!vw || !snap?.anchor?.debug?.length) return;
    const map = coverMap(vw, vh, canvas.width, canvas.height, mirrored);
    const pts = snap.anchor.debug.map((d) => ({ ...d, xy: worldToCanvas(d.point, map) }));
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(245,208,122,0.85)";
    if (product.category === "ring" && pts.length >= 5) {
      ctx.beginPath();
      ctx.moveTo(pts[0].xy.x, pts[0].xy.y);
      for (let i = 1; i < 5; i += 1) ctx.lineTo(pts[i].xy.x, pts[i].xy.y);
      ctx.stroke();
    }
    if (product.anchorType === "neck" && pts.length >= 6) {
      ctx.beginPath();
      ctx.moveTo(pts[0].xy.x, pts[0].xy.y);
      ctx.lineTo(pts[4].xy.x, pts[4].xy.y);
      ctx.lineTo(pts[1].xy.x, pts[1].xy.y);
      ctx.moveTo(pts[2].xy.x, pts[2].xy.y);
      ctx.lineTo(pts[3].xy.x, pts[3].xy.y);
      ctx.lineTo(pts[4].xy.x, pts[4].xy.y);
      ctx.lineTo(pts[5].xy.x, pts[5].xy.y);
      ctx.stroke();
    }
    for (const d of pts) {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.xy.x, d.xy.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(d.label, d.xy.x + 8, d.xy.y - 6);
    }
  }, [mode, snap, product.category, product.anchorType, video, mirrored]);

  if (mode === "off") return null;
  const q = snap;
  const rot = q?.anchor?.quaternion;
  const p = q?.anchor?.point;
  const sc = q?.anchor?.pixelsPerMm ?? 0;

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      <aside className="pointer-events-none absolute left-3 top-16 z-30 max-h-[78svh] w-[min(100%-1.5rem,320px)] overflow-y-auto rounded-2xl border border-white/20 bg-black/78 p-3 text-white backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">Debug · {mode === "anchors" ? "anchors only" : "overlay"}</p>
        <div className="mt-2 space-y-1">
          <Row k="TRACKER" v={q?.trackerRunning ? "RUNNING" : "NOT RUNNING"} />
          <Row k="FPS" v={`${q?.fps ?? 0} render · ${q?.trackingFps ?? 0} track`} />
          <Row k="PRODUCT TYPE" v={product.category} />
          <Row k="ASSET TYPE" v={q?.assetKind ?? "missing"} />
          <Row k="ASSET URL" v={q?.assetUrl || "—"} />
          <Row k="TRACKING CONFIDENCE" v={(q?.confidence ?? 0).toFixed(2)} />
          <Row k="ANCHOR X/Y/Z" v={p ? `${p.x.toFixed(3)} / ${p.y.toFixed(3)} / ${p.z.toFixed(3)}` : "—"} />
          <Row k="ROTATION" v={rot ? `${rot.x.toFixed(2)} ${rot.y.toFixed(2)} ${rot.z.toFixed(2)} ${rot.w.toFixed(2)}` : "—"} />
          <Row k="SCALE" v={sc ? sc.toExponential(2) : "—"} />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-white/45">QA</p>
        <div className="mt-1 space-y-0.5">
          <Qa label="Camera running?" pass={Boolean(q?.cameraRunning)} />
          <Qa label="Tracker running?" pass={Boolean(q?.trackerRunning)} />
          <Qa label="Landmarks?" pass={Boolean(q?.hasLandmarks && q.anchor?.debug?.length)} />
          <Qa label="Correct product?" pass={q?.productType === product.category} />
          <Qa label="Transparent asset?" pass={q?.assetKind === "image"} skip={q?.assetKind === "glb"} />
          <Qa label="3D model?" pass={q?.assetKind === "glb"} />
          <Qa label="Anchor valid?" pass={Boolean(q?.anchor?.visible && p && Number.isFinite(p.z) && p.z < 0)} />
          <Qa label="Scale valid?" pass={Boolean(q?.scaleValid)} />
          <Qa label="Occlusion?" pass={Boolean(q?.occlusionActive)} />
          <Qa label="FPS?" pass={Boolean(q && q.fps >= 20)} />
        </div>
      </aside>
    </>
  );
}
