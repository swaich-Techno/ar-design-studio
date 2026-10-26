import type { JewelleryAnchor } from "./types";
import type {
  FaceFrame,
  Landmark,
  OverlayAnchor,
  ResolvedCalibration,
  TrackingSnapshot,
  TryOnProduct,
  ViewportMap,
} from "../types";
import { FACE_WIDTH_MM, LM, getLm } from "../utils/transforms";
import {
  MM,
  depthFromRealWidth,
  headBasisFromPose,
  landmarkToWorld,
  offsetWorld,
  quatFromBasis,
  spanCanvasFrac,
} from "../utils/cameraSpace";

function mix(a: Landmark, b: Landmark, t: number): Landmark {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function add(a: Landmark, b: Landmark): Landmark {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scaleLm(a: Landmark, s: number): Landmark {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

/**
 * Ear lobe from tragus + jaw + a small outward / downward nudge.
 * Image-left landmark 234 is the subject's right ear (before selfie mirror).
 */
function lobePoint(landmarks: Landmark[], side: "imageLeft" | "imageRight"): Landmark {
  const tragus = getLm(landmarks, side === "imageLeft" ? LM.imageLeftEar : LM.imageRightEar);
  const jaw = getLm(landmarks, side === "imageLeft" ? LM.imageLeftJaw : LM.imageRightJaw);
  const cheek = getLm(landmarks, side === "imageLeft" ? LM.imageLeftCheek : LM.imageRightCheek);
  const lobeHint = getLm(landmarks, side === "imageLeft" ? LM.imageLeftLobe : LM.imageRightLobe);
  const chin = getLm(landmarks, LM.chin);
  const mid = mix(tragus, jaw, 0.35);
  const withLobe = mix(mid, lobeHint, 0.45);
  const down = scaleLm({ x: chin.x - tragus.x, y: chin.y - tragus.y, z: chin.z - tragus.z }, 0.08);
  const out = scaleLm(
    { x: tragus.x - cheek.x, y: tragus.y - cheek.y, z: tragus.z - cheek.z },
    0.55,
  );
  return add(add(withLobe, down), out);
}

export class EarringAnchor implements JewelleryAnchor<OverlayAnchor> {
  readonly category = "earring" as const;
  readonly implemented = true;

  compute(
    tracking: TrackingSnapshot,
    product: TryOnProduct,
    calibration: ResolvedCalibration,
    viewport: ViewportMap,
  ): OverlayAnchor | null {
    const face: FaceFrame | null = tracking.face;
    if (!face || face.landmarks.length < 400) return null;
    const vfov = viewport.vfovDeg;
    const faceFrac = spanCanvasFrac(
      getLm(face.landmarks, LM.imageLeftEar),
      getLm(face.landmarks, LM.imageRightEar),
      viewport,
    );
    const depth = depthFromRealWidth(faceFrac, FACE_WIDTH_MM * MM, viewport, vfov);
    const pose = face.pose;
    const basis = headBasisFromPose(pose.yaw, pose.pitch, pose.roll);
    const q = quatFromBasis(basis);

    const rawLeft = viewport.mirrored
      ? lobePoint(face.landmarks, "imageRight")
      : lobePoint(face.landmarks, "imageLeft");
    const rawRight = viewport.mirrored
      ? lobePoint(face.landmarks, "imageLeft")
      : lobePoint(face.landmarks, "imageRight");

    const leftWorld = landmarkToWorld(rawLeft, viewport, depth, vfov);
    const rightWorld = landmarkToWorld(rawRight, viewport, depth, vfov);

    const off = calibration.positionOffset;
    const lr = calibration.leftRightAdjustment;
    const ao = product.anchorOffset;
    const left = offsetWorld(
      leftWorld,
      off.x - lr.x + ao.x,
      off.y - lr.y + ao.y,
      off.z + ao.z,
      basis,
    );
    const right = offsetWorld(
      rightWorld,
      off.x + lr.x + ao.x,
      off.y + lr.y + ao.y,
      off.z + ao.z,
      basis,
    );

    const ppm = (FACE_WIDTH_MM * MM) / FACE_WIDTH_MM;
    return {
      mode: "pair",
      left,
      right,
      point: { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2, z: (left.z + right.z) / 2 },
      pose: { ...pose, scale: ppm * calibration.scaleMultiplier },
      quaternion: q,
      basis,
      pixelsPerMm: MM,
      visible: true,
    };
  }
}
