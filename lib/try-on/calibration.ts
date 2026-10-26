import type { CalibrationOverride, ResolvedCalibration, TryOnProduct, Vec3 } from "./types";

export const CALIBRATION_STORAGE_KEY = "bsocio-tryon-calibration-v2";

const ZERO: Vec3 = { x: 0, y: 0, z: 0 };

/** Per-asset defaults. Tracker math stays category-generic; overrides live here. */
export const calibrationMap: Record<string, CalibrationOverride> = {
  "gold-hoop": {
    scaleMultiplier: 1,
    positionOffset: { x: 0, y: 1.5, z: -1 },
  },
  "pearl-drop": {
    scaleMultiplier: 1,
    positionOffset: { x: 0, y: 2, z: -1.2 },
  },
  "diamond-stud": {
    scaleMultiplier: 1.05,
    rotationOffset: { x: 12, y: 0, z: 0 },
    positionOffset: { x: 0, y: 0.5, z: -0.6 },
  },
  "jhumka-drop": {
    scaleMultiplier: 0.98,
    positionOffset: { x: 0, y: 2.2, z: -1.4 },
  },
  ring: {
    scaleMultiplier: 1,
    positionOffset: { x: 0, y: 0, z: 0 },
    fingerT: 0.35,
  },
  necklace: {
    scaleMultiplier: 1,
    positionOffset: { x: 0, y: 6, z: 4 },
  },
  pendant: {
    scaleMultiplier: 1,
    positionOffset: { x: 0, y: -8, z: 4 },
  },
};

function mergeVec(base: Vec3, extra?: Partial<Vec3>): Vec3 {
  return {
    x: base.x + (extra?.x ?? 0),
    y: base.y + (extra?.y ?? 0),
    z: base.z + (extra?.z ?? 0),
  };
}

function readStored(): Record<string, CalibrationOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CALIBRATION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function calibrationKey(productOrId: string | TryOnProduct) {
  if (typeof productOrId === "string") return productOrId;
  return productOrId.sku || productOrId.id;
}

export function loadStoredCalibration(id: string): CalibrationOverride {
  const all = readStored();
  return all[id] ?? {};
}

export function saveStoredCalibration(id: string, override: CalibrationOverride) {
  if (typeof window === "undefined") return;
  const all = readStored();
  all[id] = override;
  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(all));
}

export function clearStoredCalibration(id?: string) {
  if (typeof window === "undefined") return;
  if (!id) {
    window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    return;
  }
  const all = readStored();
  delete all[id];
  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(all));
}

export function resolveCalibration(product: TryOnProduct, live?: CalibrationOverride): ResolvedCalibration {
  const mapped = calibrationMap[product.id] ?? calibrationMap[product.sku] ?? {};
  const stored = live ?? loadStoredCalibration(calibrationKey(product));
  return {
    scaleMultiplier:
      (product.scaleMultiplier || 1) *
      (mapped.scaleMultiplier ?? 1) *
      (stored.scaleMultiplier ?? 1),
    positionOffset: mergeVec(
      mergeVec(product.positionOffset ?? ZERO, mapped.positionOffset),
      stored.positionOffset,
    ),
    rotationOffset: mergeVec(
      mergeVec(product.rotationOffset ?? ZERO, mapped.rotationOffset),
      stored.rotationOffset,
    ),
    leftRightAdjustment: mergeVec(
      mergeVec(product.leftRightAdjustment ?? ZERO, mapped.leftRightAdjustment),
      stored.leftRightAdjustment,
    ),
    fingerT: stored.fingerT ?? mapped.fingerT ?? 0.35,
  };
}
