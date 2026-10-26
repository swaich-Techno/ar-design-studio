import type { Landmark, ScreenPoint, Vec3, ViewportMap } from "../types";

/** Typical selfie-camera vertical FOV before object-fit cover. */
export const VIDEO_VFOV_DEG = 58;

/** Millimetres → metres. Try-on meshes are authored in millimetres. */
export const MM = 0.001;

export function visibleVerticalFovDeg(viewport: Omit<ViewportMap, "vfovDeg">, videoVfovDeg = VIDEO_VFOV_DEG) {
  if (viewport.contentH > viewport.canvasHeight + 0.5) {
    const v = (videoVfovDeg * Math.PI) / 180;
    const crop = viewport.canvasHeight / Math.max(viewport.contentH, 1);
    return (2 * Math.atan(Math.tan(v / 2) * crop) * 180) / Math.PI;
  }
  return videoVfovDeg;
}

export function depthFromRealWidth(
  widthCanvasFrac: number,
  realWidthM: number,
  viewport: ViewportMap,
  vfovDeg: number,
) {
  const aspect = viewport.canvasWidth / Math.max(viewport.canvasHeight, 1);
  const tanX = Math.tan(((vfovDeg * Math.PI) / 180) / 2) * aspect;
  return realWidthM / (2 * Math.max(widthCanvasFrac, 1e-4) * Math.max(tanX, 1e-4));
}

export function canvasToWorld(
  sx: number,
  sy: number,
  depthM: number,
  zRelM: number,
  viewport: ViewportMap,
  vfovDeg: number,
): ScreenPoint {
  const aspect = viewport.canvasWidth / Math.max(viewport.canvasHeight, 1);
  const vfov = (vfovDeg * Math.PI) / 180;
  const tanY = Math.tan(vfov / 2);
  const tanX = tanY * aspect;
  const ndcX = (sx / Math.max(viewport.canvasWidth, 1)) * 2 - 1;
  const ndcY = 1 - (sy / Math.max(viewport.canvasHeight, 1)) * 2;
  const zCam = Math.min(-(depthM) + zRelM, -0.06);
  return {
    x: ndcX * tanX * -zCam,
    y: ndcY * tanY * -zCam,
    z: zCam,
  };
}

export function landmarkToWorld(
  lm: Landmark,
  viewport: ViewportMap,
  depthM: number,
  vfovDeg: number,
  zScale = 1,
): ScreenPoint {
  const nx = viewport.mirrored ? 1 - lm.x : lm.x;
  const sx = viewport.contentX + nx * viewport.contentW;
  const sy = viewport.contentY + lm.y * viewport.contentH;
  const aspect = viewport.canvasWidth / Math.max(viewport.canvasHeight, 1);
  const tanX = Math.tan(((vfovDeg * Math.PI) / 180) / 2) * aspect;
  const zRelM = lm.z * (2 * depthM * tanX) * zScale;
  return canvasToWorld(sx, sy, depthM, zRelM, viewport, vfovDeg);
}

export function spanCanvasFrac(a: Landmark, b: Landmark, viewport: ViewportMap) {
  return (Math.hypot(a.x - b.x, a.y - b.y) * viewport.contentW) / Math.max(viewport.canvasWidth, 1);
}

export function offsetWorld(point: ScreenPoint, oxMm: number, oyMm: number, ozMm: number, basis: { x: Vec3; y: Vec3; z: Vec3 }): ScreenPoint {
  const ox = oxMm * MM;
  const oy = oyMm * MM;
  const oz = ozMm * MM;
  return {
    x: point.x + basis.x.x * ox + basis.y.x * oy + basis.z.x * oz,
    y: point.y + basis.x.y * ox + basis.y.y * oy + basis.z.y * oz,
    z: point.z + basis.x.z * ox + basis.y.z * oy + basis.z.z * oz,
  };
}

export function quatFromBasis(basis: { x: Vec3; y: Vec3; z: Vec3 }) {
  const te = [
    basis.x.x, basis.y.x, basis.z.x,
    basis.x.y, basis.y.y, basis.z.y,
    basis.x.z, basis.y.z, basis.z.z,
  ];
  const m11 = te[0];
  const m12 = te[3];
  const m13 = te[6];
  const m21 = te[1];
  const m22 = te[4];
  const m23 = te[7];
  const m31 = te[2];
  const m32 = te[5];
  const m33 = te[8];
  const trace = m11 + m22 + m33;
  let x: number;
  let y: number;
  let z: number;
  let w: number;
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    w = 0.25 / s;
    x = (m32 - m23) * s;
    y = (m13 - m31) * s;
    z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
    w = (m32 - m23) / s;
    x = 0.25 * s;
    y = (m12 + m21) / s;
    z = (m13 + m31) / s;
  } else if (m22 > m33) {
    const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
    w = (m13 - m31) / s;
    x = (m12 + m21) / s;
    y = 0.25 * s;
    z = (m23 + m32) / s;
  } else {
    const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
    w = (m21 - m12) / s;
    x = (m13 + m31) / s;
    y = (m23 + m32) / s;
    z = 0.25 * s;
  }
  const len = Math.hypot(x, y, z, w) || 1;
  return { x: x / len, y: y / len, z: z / len, w: w / len };
}

export function headBasisFromPose(yaw: number, pitch: number, roll: number): { x: Vec3; y: Vec3; z: Vec3 } {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  // YXZ: yaw Y, pitch X, roll Z — applied to the identity basis.
  const x: Vec3 = {
    x: cy * cr + sy * sp * sr,
    y: cp * sr,
    z: -sy * cr + cy * sp * sr,
  };
  const y: Vec3 = {
    x: -cy * sr + sy * sp * cr,
    y: cp * cr,
    z: sy * sr + cy * sp * cr,
  };
  const z: Vec3 = {
    x: sy * cp,
    y: -sp,
    z: cy * cp,
  };
  return { x, y, z };
}
