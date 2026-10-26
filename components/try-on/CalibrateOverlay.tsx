"use client";

import { useMemo } from "react";
import type { ResolvedCalibration, TryOnProduct } from "@/lib/try-on/types";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-[11px] text-white/80">
      <span>{label}</span>
      <span className="tabular-nums text-white/50">{value.toFixed(2)}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="col-span-2 h-8 w-full accent-[var(--gold)]"
      />
    </label>
  );
}

export function CalibrateOverlay({
  product,
  value,
  onChange,
  onSave,
  onReset,
  fps,
  faceDetected,
}: {
  product: TryOnProduct;
  value: ResolvedCalibration;
  onChange: (next: ResolvedCalibration) => void;
  onSave: () => void;
  onReset: () => void;
  fps: number;
  faceDetected: boolean;
}) {
  const set = useMemo(
    () => ({
      scale: (n: number) => onChange({ ...value, scaleMultiplier: n }),
      pos: (axis: "x" | "y" | "z", n: number) =>
        onChange({ ...value, positionOffset: { ...value.positionOffset, [axis]: n } }),
      rot: (axis: "x" | "y" | "z", n: number) =>
        onChange({ ...value, rotationOffset: { ...value.rotationOffset, [axis]: n } }),
      lr: (axis: "x" | "y" | "z", n: number) =>
        onChange({ ...value, leftRightAdjustment: { ...value.leftRightAdjustment, [axis]: n } }),
      fingerT: (n: number) => onChange({ ...value, fingerT: n }),
    }),
    [onChange, value],
  );

  const ears = product.anchorType === "ears";
  const neck = product.anchorType === "neck";
  const finger = product.anchorType === "finger";
  const yMin = neck ? -80 : -20;
  const yMax = neck ? 80 : 20;

  return (
    <aside className="pointer-events-auto absolute right-3 top-16 z-30 max-h-[70svh] w-[min(100%-1.5rem,280px)] overflow-y-auto rounded-2xl border border-white/15 bg-black/75 p-3 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">Calibrate · {product.sku}</p>
      <p className="mt-1 text-[10px] text-white/50">
        {faceDetected ? "Tracking" : "No lock"} · {fps} fps · writes localStorage
      </p>
      <div className="mt-3 grid gap-2">
        <Slider label="Scale" value={value.scaleMultiplier} min={0.4} max={2.2} step={0.01} onChange={set.scale} />
        <Slider label="Offset X mm" value={value.positionOffset.x} min={-20} max={20} step={0.1} onChange={(n) => set.pos("x", n)} />
        <Slider
          label={neck ? "Necklace Y mm" : "Offset Y mm"}
          value={value.positionOffset.y}
          min={yMin}
          max={yMax}
          step={0.1}
          onChange={(n) => set.pos("y", n)}
        />
        <Slider label="Offset Z mm" value={value.positionOffset.z} min={-20} max={20} step={0.1} onChange={(n) => set.pos("z", n)} />
        <Slider label="Rot X°" value={value.rotationOffset.x} min={-45} max={45} step={0.5} onChange={(n) => set.rot("x", n)} />
        <Slider label="Rot Y°" value={value.rotationOffset.y} min={-45} max={45} step={0.5} onChange={(n) => set.rot("y", n)} />
        <Slider label="Rot Z°" value={value.rotationOffset.z} min={-45} max={45} step={0.5} onChange={(n) => set.rot("z", n)} />
        {ears ? (
          <>
            <Slider label="L/R X mm" value={value.leftRightAdjustment.x} min={-12} max={12} step={0.1} onChange={(n) => set.lr("x", n)} />
            <Slider label="L/R Y mm" value={value.leftRightAdjustment.y} min={-12} max={12} step={0.1} onChange={(n) => set.lr("y", n)} />
          </>
        ) : null}
        {finger ? (
          <Slider label="Ring finger t" value={value.fingerT} min={0.08} max={0.7} step={0.01} onChange={set.fingerT} />
        ) : null}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="min-h-9 flex-1 rounded-full bg-[var(--gold)] text-xs text-black" onClick={onSave}>
          Save
        </button>
        <button type="button" className="min-h-9 flex-1 rounded-full border border-white/20 text-xs" onClick={onReset}>
          Reset
        </button>
      </div>
    </aside>
  );
}
