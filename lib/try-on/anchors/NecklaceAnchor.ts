import type { JewelleryAnchor } from "./types";
import type { OverlayAnchor, ResolvedCalibration, TrackingSnapshot, TryOnProduct, ViewportMap } from "../types";
import {
  FACE_WIDTH_MM,
  LM,
  POSE_LM,
  SHOULDER_WIDTH_MM,
  clamp,
  getLm,
  normalize3,
  cross3,
} from "../utils/transforms";
import {
  MM,
  depthFromRealWidth,
  landmarkToWorld,
  offsetWorld,
  quatFromBasis,
  spanCanvasFrac,
} from "../utils/cameraSpace";

export class NecklaceAnchor implements JewelleryAnchor<OverlayAnchor> {
  readonly category = "necklace" as const;
  readonly implemented = true;

  compute(
    tracking: TrackingSnapshot,
    product: TryOnProduct,
    calibration: ResolvedCalibration,
    viewport: ViewportMap,
  ): OverlayAnchor | null {
    const face = tracking.face;
    const pose = tracking.pose;
    const pendant = product.category === "pendant";
    if (!face && !pose) return null;
    const vfov = viewport.vfovDeg;

    let leftW;
    let rightW;
    let chestW;
    let depth: number;

    if (pose && pose.landmarks.length >= 13) {
      const ls = getLm(pose.landmarks, POSE_LM.leftShoulder);
      const rs = getLm(pose.landmarks, POSE_LM.rightShoulder);
      const nose = getLm(pose.landmarks, POSE_LM.nose);
      const shoulderFrac = spanCanvasFrac(ls, rs, viewport);
      depth = depthFromRealWidth(shoulderFrac, SHOULDER_WIDTH_MM * MM, viewport, vfov);
      const lsW = landmarkToWorld(ls, viewport, depth, vfov, 0.9);
      const rsW = landmarkToWorld(rs, viewport, depth, vfov, 0.9);
      const noseW = landmarkToWorld(nose, viewport, depth, vfov, 0.9);
      const shoulderMid = {
        x: (lsW.x + rsW.x) * 0.5,
        y: (lsW.y + rsW.y) * 0.5,
        z: (lsW.z + rsW.z) * 0.5,
      };
      let chinW = mixWorld(noseW, shoulderMid, 0.55);
      if (face && face.landmarks.length > 152) {
        const faceFrac = spanCanvasFrac(
          getLm(face.landmarks, LM.imageLeftEar),
          getLm(face.landmarks, LM.imageRightEar),
          viewport,
        );
        const faceDepth = depthFromRealWidth(faceFrac, FACE_WIDTH_MM * MM, viewport, vfov);
        chinW = landmarkToWorld(getLm(face.landmarks, LM.chin), viewport, faceDepth, vfov);
      }
      const neckT = pendant ? 0.55 : 0.38;
      const chestT = pendant ? 0.72 : 0.5;
      const neck = mixWorld(chinW, shoulderMid, neckT);
      chestW = mixWorld(neck, mixWorld(shoulderMid, { x: shoulderMid.x, y: shoulderMid.y - 0.12, z: shoulderMid.z }, 0.16), chestT);
      leftW = mixWorld(lsW, chinW, 0.42);
      rightW = mixWorld(rsW, chinW, 0.42);
    } else if (face && face.landmarks.length > 152) {
      const faceFrac = spanCanvasFrac(
        getLm(face.landmarks, LM.imageLeftEar),
        getLm(face.landmarks, LM.imageRightEar),
        viewport,
      );
      depth = depthFromRealWidth(faceFrac, FACE_WIDTH_MM * MM, viewport, vfov);
      const chin = landmarkToWorld(getLm(face.landmarks, LM.chin), viewport, depth, vfov);
      const forehead = landmarkToWorld(getLm(face.landmarks, LM.forehead), viewport, depth, vfov);
      const leftEar = landmarkToWorld(getLm(face.landmarks, LM.imageLeftEar), viewport, depth, vfov);
      const rightEar = landmarkToWorld(getLm(face.landmarks, LM.imageRightEar), viewport, depth, vfov);
      const down = { x: chin.x - forehead.x, y: chin.y - forehead.y, z: chin.z - forehead.z };
      const t = pendant ? 0.95 : 0.55;
      chestW = { x: chin.x + down.x * t, y: chin.y + down.y * t, z: chin.z + down.z * t };
      leftW = { x: leftEar.x, y: (leftEar.y + chin.y) * 0.5, z: leftEar.z };
      rightW = { x: rightEar.x, y: (rightEar.y + chin.y) * 0.5, z: rightEar.z };
    } else {
      return null;
    }

    const x = normalize3({ x: rightW.x - leftW.x, y: rightW.y - leftW.y, z: rightW.z - leftW.z });
    let z = normalize3(cross3(x, { x: 0, y: 1, z: 0 }));
    if (z.z < 0) z = { x: -z.x, y: -z.y, z: -z.z };
    const y = normalize3(cross3(z, x));
    const basis = { x, y, z };

    const off = calibration.positionOffset;
    const ao = product.anchorOffset;
    chestW = offsetWorld(chestW, off.x + ao.x, off.y + ao.y, off.z + ao.z, basis);
    leftW = offsetWorld(leftW, ao.x, ao.y * 0.2, ao.z, basis);
    rightW = offsetWorld(rightW, ao.x, ao.y * 0.2, ao.z, basis);

    const yaw = Math.atan2(x.z, x.x);
    const pitch = clamp(Math.asin(clamp(-y.z, -1, 1)), -0.5, 0.5);
    const roll = Math.atan2(x.y, x.x);
    const vis = (lm: { visibility?: number } | undefined) => (typeof lm?.visibility === "number" ? lm.visibility : 0.72);
    const confidence = pose && pose.landmarks.length >= 13
      ? clamp((vis(pose.landmarks[11]) + vis(pose.landmarks[12]) + vis(pose.landmarks[0])) / 3, 0.2, 0.98)
      : face ? 0.55 : 0.3;

    const noseW = pose && pose.landmarks.length >= 13
      ? landmarkToWorld(getLm(pose.landmarks, POSE_LM.nose), viewport, depth, vfov, 0.9)
      : chestW;
    const chinDbg = face && face.landmarks.length > 152
      ? landmarkToWorld(getLm(face.landmarks, LM.chin), viewport, depth, vfov)
      : mixWorld(noseW, chestW, 0.35);
    const lsDbg = leftW;
    const rsDbg = rightW;
    const neckCenter = mixWorld(chinDbg, { x: (leftW.x + rightW.x) * 0.5, y: (leftW.y + rightW.y) * 0.5, z: (leftW.z + rightW.z) * 0.5 }, 0.45);

    return {
      mode: "single",
      left: leftW,
      right: rightW,
      point: chestW,
      pose: { yaw, pitch, roll, scale: MM * calibration.scaleMultiplier },
      quaternion: quatFromBasis(basis),
      basis,
      pixelsPerMm: MM * calibration.scaleMultiplier,
      visible: true,
      confidence,
      chain: {
        left: leftW,
        pendant: chestW,
        right: rightW,
      },
      debug: [
        { id: "lShoulder", label: "L SHOULDER", point: lsDbg, color: "#7dd3fc" },
        { id: "rShoulder", label: "R SHOULDER", point: rsDbg, color: "#7dd3fc" },
        { id: "nose", label: "NOSE", point: noseW, color: "#fbbf24" },
        { id: "chin", label: "CHIN", point: chinDbg, color: "#34d399" },
        { id: "neck", label: "NECK", point: neckCenter, color: "#a78bfa" },
        { id: "chest", label: pendant ? "PENDANT" : "CHEST", point: chestW, color: "#f5d07a" },
      ],
    };
  }
}

function mixWorld(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }, t: number) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}
