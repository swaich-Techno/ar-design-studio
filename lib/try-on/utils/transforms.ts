import type { HeadPose, Landmark, ScreenPoint, ViewportMap } from "../types";

export const LM = {
  noseTip: 1,
  nose: 4,
  forehead: 10,
  chin: 152,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftEyeInner: 133,
  rightEyeInner: 362,
  /** Image-left / subject-right tragus. */
  imageLeftEar: 234,
  /** Image-right / subject-left tragus. */
  imageRightEar: 454,
  imageLeftCheek: 93,
  imageRightCheek: 323,
  imageLeftJaw: 132,
  imageRightJaw: 361,
  imageLeftLobe: 177,
  imageRightLobe: 401,
} as const;

/** Mean adult inter-pupillary distance. Used to convert face pixels → mm. */
export const IPD_MM = 63;
export const FACE_WIDTH_MM = 140;

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

export function coverMap(
  videoWidth: number,
  videoHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  mirrored: boolean,
  videoVfovDeg = 58,
): ViewportMap {
  const videoAspect = videoWidth / Math.max(videoHeight, 1);
  const canvasAspect = canvasWidth / Math.max(canvasHeight, 1);
  let contentW: number;
  let contentH: number;
  if (videoAspect > canvasAspect) {
    contentH = canvasHeight;
    contentW = canvasHeight * videoAspect;
  } else {
    contentW = canvasWidth;
    contentH = canvasWidth / videoAspect;
  }
  const map = {
    canvasWidth,
    canvasHeight,
    contentW,
    contentH,
    contentX: (canvasWidth - contentW) / 2,
    contentY: (canvasHeight - contentH) / 2,
    mirrored,
    vfovDeg: videoVfovDeg,
  };
  if (contentH > canvasHeight + 0.5) {
    const v = (videoVfovDeg * Math.PI) / 180;
    const crop = canvasHeight / Math.max(contentH, 1);
    map.vfovDeg = (2 * Math.atan(Math.tan(v / 2) * crop) * 180) / Math.PI;
  }
  return map;
}

export function landmarkToScreen(lm: Landmark, map: ViewportMap): ScreenPoint {
  const nx = map.mirrored ? 1 - lm.x : lm.x;
  return {
    x: map.contentX + nx * map.contentW,
    y: map.contentY + lm.y * map.contentH,
    z: lm.z * map.contentW,
  };
}

export function getLm(landmarks: Landmark[], index: number): Landmark {
  return landmarks[index] ?? { x: 0.5, y: 0.5, z: 0 };
}

export function dist2(a: Landmark, b: Landmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function poseFromMatrix(data: ArrayLike<number>, mirrored: boolean): HeadPose | null {
  if (!data || data.length < 16) return null;
  const r00 = data[0];
  const r01 = data[4];
  const r02 = data[8];
  const r11 = data[5];
  const r20 = data[2];
  const r21 = data[6];
  const r22 = data[10];
  const pitch = Math.asin(clamp(-r21, -1, 1));
  const cy = Math.cos(pitch);
  let yaw: number;
  let roll: number;
  if (Math.abs(cy) > 1e-4) {
    yaw = Math.atan2(r20, r22);
    roll = Math.atan2(r01, r11);
  } else {
    yaw = Math.atan2(-r02, r00);
    roll = 0;
  }
  if (mirrored) {
    yaw = -yaw;
    roll = -roll;
  }
  return { yaw, pitch, roll, scale: 1 };
}

export function poseFromLandmarks(landmarks: Landmark[], mirrored: boolean): HeadPose {
  const leftEye = getLm(landmarks, LM.leftEyeOuter);
  const rightEye = getLm(landmarks, LM.rightEyeOuter);
  const nose = getLm(landmarks, LM.noseTip);
  const chin = getLm(landmarks, LM.chin);
  const lx = mirrored ? 1 - leftEye.x : leftEye.x;
  const rx = mirrored ? 1 - rightEye.x : rightEye.x;
  const nx = mirrored ? 1 - nose.x : nose.x;
  const ly = leftEye.y;
  const ry = rightEye.y;
  const roll = Math.atan2(ry - ly, rx - lx);
  const midX = (lx + rx) / 2;
  const yaw = clamp((nx - midX) * 6.2, -1.1, 1.1);
  const midY = (ly + ry) / 2;
  const faceH = Math.max(chin.y - midY, 0.04);
  const pitch = clamp(((nose.y - midY) / faceH - 0.28) * 1.6, -0.7, 0.7);
  return { yaw, pitch, roll, scale: 1 };
}

export function pixelsPerMmFromFace(landmarks: Landmark[], map: ViewportMap) {
  const left = getLm(landmarks, LM.leftEyeOuter);
  const right = getLm(landmarks, LM.rightEyeOuter);
  const ipdPx = dist2(left, right) * map.contentW;
  const ears = dist2(getLm(landmarks, LM.imageLeftEar), getLm(landmarks, LM.imageRightEar)) * map.contentW;
  const fromIpd = ipdPx / IPD_MM;
  const fromEars = ears / FACE_WIDTH_MM;
  const ppm = fromIpd > 0.15 ? fromIpd * 0.65 + fromEars * 0.35 : fromEars;
  return clamp(ppm, 0.35, 14);
}

export const HAND_LM = {
  wrist: 0,
  indexMcp: 5,
  middleMcp: 9,
  ringMcp: 13,
  ringPip: 14,
  ringDip: 15,
  ringTip: 16,
  pinkyMcp: 17,
} as const;

export const POSE_LM = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftHip: 23,
  rightHip: 24,
} as const;

export const RING_FINGER_LENGTH_MM = 24;
export const SHOULDER_WIDTH_MM = 380;
export const RING_INNER_MM = 17;

export function subLm(a: Landmark, b: Landmark): Landmark {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function addLm(a: Landmark, b: Landmark): Landmark {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function mixLm(a: Landmark, b: Landmark, t: number): Landmark {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

export function scaleLm(a: Landmark, s: number): Landmark {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

export function length3(a: Landmark) {
  return Math.hypot(a.x, a.y, a.z) || 1e-6;
}

export function normalize3(a: Landmark): Landmark {
  const len = length3(a);
  return { x: a.x / len, y: a.y / len, z: a.z / len };
}

export function cross3(a: Landmark, b: Landmark): Landmark {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function coverDrawSource(
  videoW: number,
  videoH: number,
  destW: number,
  destH: number,
) {
  const videoAspect = videoW / Math.max(videoH, 1);
  const destAspect = destW / Math.max(destH, 1);
  let sx = 0;
  let sy = 0;
  let sw = videoW;
  let sh = videoH;
  if (videoAspect > destAspect) {
    sw = videoH * destAspect;
    sx = (videoW - sw) / 2;
  } else {
    sh = videoW / destAspect;
    sy = (videoH - sh) / 2;
  }
  return { sx, sy, sw, sh };
}
