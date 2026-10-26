"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TryOnEngine } from "@/lib/try-on/engine";
import {
  defaultTryOnProduct,
  jewelleryTryOnProducts,
  resolveTryOnAsset,
  tryOnModeLabel,
  tryOnPath,
  tryOnWhatsApp,
} from "@/lib/try-on/catalog";
import { clearStoredCalibration, resolveCalibration, saveStoredCalibration } from "@/lib/try-on/calibration";
import { prefersReducedMotion } from "@/lib/redesign/runtime";
import type { DebugMode, ResolvedCalibration, TryOnProduct } from "@/lib/try-on/types";
import { CameraPermission } from "./CameraPermission";
import { ProductCarousel } from "./ProductCarousel";
import { TryOnControls } from "./TryOnControls";
import { CalibrateOverlay } from "./CalibrateOverlay";
import { TryOnDebug } from "./TryOnDebug";
import type { EngineSnapshot } from "@/lib/try-on/engine";

type Phase = "permission" | "starting" | "live" | "fallback";

export function TryOnViewer({
  product,
  calibrate = false,
  debug = "off",
}: {
  product: TryOnProduct;
  calibrate?: boolean;
  debug?: DebugMode;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TryOnEngine | null>(null);
  const [phase, setPhase] = useState<Phase>("permission");
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(product);
  const [detected, setDetected] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [calibration, setCalibration] = useState<ResolvedCalibration>(() => resolveCalibration(product));
  const [mirrored, setMirrored] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [engineSnap, setEngineSnap] = useState<EngineSnapshot | null>(null);

  useEffect(() => {
    setCurrent(product);
    setCalibration(resolveCalibration(product));
  }, [product]);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    setPhase("starting");
    setError(null);
    engineRef.current?.dispose();
    const engine = new TryOnEngine();
    engineRef.current = engine;
    const result = await engine.attach({ video, canvas, product: current });
    if (result.ok === false) {
      setError(result.message);
      setPhase("fallback");
      return;
    }
    engine.setDebugMode(debug);
    engine.setCalibration(resolveCalibration(current));
    setMirrored(engine.mirrored);
    setPhase("live");
  }, [current, debug]);

  useEffect(() => {
    if (phase !== "live") return;
    const id = window.setInterval(() => {
      const snap = engineRef.current?.snapshot();
      if (!snap) return;
      setDetected(current.anchorType === "finger" ? snap.bodyDetected : snap.faceDetected || snap.bodyDetected);
      setHint(snap.hint);
      setFps(snap.fps);
      setEngineSnap(snap);
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, current.anchorType]);

  async function switchProduct(id: string) {
    const next = jewelleryTryOnProducts.find((item) => item.id === id);
    if (!next) return;
    setCurrent(next);
    const cal = resolveCalibration(next);
    setCalibration(cal);
    if (engineRef.current && phase === "live") {
      engineRef.current.setDebugMode(debug);
      await engineRef.current.setProduct(next);
      engineRef.current.setCalibration(cal);
    }
    const q = new URLSearchParams();
    if (calibrate) q.set("calibrate", "1");
    if (debug === "1" || debug === "anchors") q.set("debug", debug);
    const qs = q.toString();
    const path = calibrate ? `/ar/try-on/calibrate?id=${next.id}${qs ? `&${qs}` : ""}` : `${tryOnPath(next.id)}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", path);
  }

  function applyCalibration(next: ResolvedCalibration) {
    setCalibration(next);
    engineRef.current?.setCalibration(next);
  }

  async function onScreenshot() {
    const data = await engineRef.current?.screenshot();
    if (!data) {
      setToast("Screenshot failed");
      return;
    }
    const a = document.createElement("a");
    a.href = data;
    a.download = `${current.id}-try-on.png`;
    a.click();
    setToast("Screenshot saved");
    window.setTimeout(() => setToast(null), 1800);
  }

  async function onFlip() {
    const result = await engineRef.current?.flipCamera();
    if (result && result.ok === false) {
      setToast(result.message);
      return;
    }
    setMirrored(engineRef.current?.mirrored ?? true);
  }

  function onReset() {
    clearStoredCalibration(current.sku);
    clearStoredCalibration(current.id);
    const fresh = resolveCalibration(current, {});
    applyCalibration(fresh);
    engineRef.current?.resetAlignment();
    setToast("Alignment reset");
    window.setTimeout(() => setToast(null), 1600);
  }

  const showChrome = phase === "starting" || phase === "live";

  return (
    <div className="try-on-shell relative min-h-[100svh] overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
        playsInline
        muted
        autoPlay
      />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      {phase === "live" ? (
        <TryOnDebug mode={debug} snap={engineSnap} product={current} video={videoRef.current} mirrored={mirrored} />
      ) : null}

      {phase === "permission" || phase === "starting" || phase === "fallback" ? (
        <div className="absolute inset-0 z-20">
          <CameraPermission
            busy={phase === "starting"}
            error={error}
            product={current}
            onAllow={start}
            onView3d={() => router.push("/ar/jewellery")}
          />
        </div>
      ) : null}

      {showChrome ? (
        <>
          <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Link
              href="/ar/jewellery"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 text-lg"
              aria-label="Close try-on"
            >
              ×
            </Link>
            <div className="optical-glass max-w-[70%] rounded-full px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">Virtual Try-On — Beta</p>
              <p className="truncate text-sm">{current.name}</p>
              <p className="text-[10px] text-white/55">{tryOnModeLabel(current)}</p>
            </div>
            <span className="w-11" />
          </header>

          {phase === "live" && resolveTryOnAsset(current).kind === "missing" ? (
            <p className="absolute inset-x-0 top-24 z-20 px-4 text-center text-sm text-[var(--gold)]">
              Try-On asset is being prepared.
            </p>
          ) : phase === "live" && hint ? (
            <p className="absolute inset-x-0 top-24 z-20 px-4 text-center text-xs text-white/80">{hint}</p>
          ) : null}

          {calibrate && phase === "live" ? (
            <CalibrateOverlay
              product={current}
              value={calibration}
              fps={fps}
              faceDetected={detected}
              onChange={applyCalibration}
              onSave={() => {
                saveStoredCalibration(current.sku, {
                  scaleMultiplier: calibration.scaleMultiplier / Math.max(current.scaleMultiplier, 0.01),
                  positionOffset: {
                    x: calibration.positionOffset.x - current.positionOffset.x,
                    y: calibration.positionOffset.y - current.positionOffset.y,
                    z: calibration.positionOffset.z - current.positionOffset.z,
                  },
                  rotationOffset: {
                    x: calibration.rotationOffset.x - current.rotationOffset.x,
                    y: calibration.rotationOffset.y - current.rotationOffset.y,
                    z: calibration.rotationOffset.z - current.rotationOffset.z,
                  },
                  leftRightAdjustment: calibration.leftRightAdjustment,
                  fingerT: calibration.fingerT,
                });
                setToast("Saved to this device");
              }}
              onReset={() => {
                clearStoredCalibration(current.sku);
                clearStoredCalibration(current.id);
                applyCalibration(resolveCalibration(current, {}));
              }}
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 z-20 space-y-3 bg-gradient-to-t from-black/80 to-transparent pb-[max(1rem,env(safe-area-inset-bottom))] pt-8">
            <ProductCarousel products={jewelleryTryOnProducts} currentId={current.id} onSelect={switchProduct} />
            <TryOnControls
              onScreenshot={onScreenshot}
              onFlip={onFlip}
              onReset={onReset}
              onWhatsApp={tryOnWhatsApp(current)}
              flipAvailable
              reducedMotion={reduced}
            />
            <p className="px-4 pb-1 text-center text-[10px] uppercase tracking-[0.14em] text-white/45">
              Virtual Try-On — Beta · {current.name}
            </p>
          </div>
        </>
      ) : null}

      {toast ? (
        <p className="absolute left-1/2 top-20 z-30 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs">{toast}</p>
      ) : null}
    </div>
  );
}

export function TryOnStudio({
  productId,
  calibrate = false,
  debug = "off",
}: {
  productId?: string;
  calibrate?: boolean;
  debug?: DebugMode;
}) {
  const product = jewelleryTryOnProducts.find((item) => item.id === productId) ?? defaultTryOnProduct;
  return <TryOnViewer product={product} calibrate={calibrate} debug={debug} />;
}
