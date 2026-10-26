import type { JewelleryAnchor } from "./types";
import type { OverlayAnchor, ResolvedCalibration, TrackingSnapshot, TryOnProduct, ViewportMap } from "../types";
import {
  HAND_LM,
  RING_FINGER_LENGTH_MM,
  RING_INNER_MM,
  clamp,
  cross3,
  getLm,
  mixLm,
  normalize3,
} from "../utils/transforms";
import {
  MM,
  depthFromRealWidth,
  landmarkToWorld,
  offsetWorld,
  quatFromBasis,
  spanCanvasFrac,
} from "../utils/cameraSpace";

export class RingAnchor implements JewelleryAnchor<OverlayAnchor> {
  readonly category = "ring" as const;
  readonly implemented = true;

  compute(
    tracking: TrackingSnapshot,
    product: TryOnProduct,
    calibration: ResolvedCalibration,
    viewport: ViewportMap,
  ): OverlayAnchor | null {
    const hand = tracking.hand;
    if (!hand || hand.landmarks.length < 21) return null;
    const wrist = getLm(hand.landmarks, HAND_LM.wrist);
    const mcp = getLm(hand.landmarks, HAND_LM.ringMcp);
    const pip = getLm(hand.landmarks, HAND_LM.ringPip);
    const dip = getLm(hand.landmarks, HAND_LM.ringDip);
    const tip = getLm(hand.landmarks, HAND_LM.ringTip);
    const indexMcp = getLm(hand.landmarks, HAND_LM.indexMcp);
    const pinkyMcp = getLm(hand.landmarks, HAND_LM.pinkyMcp);

    const t = clamp(calibration.fingerT ?? 0.35, 0.3, 0.4);
    const sit = mixLm(mcp, pip, t);
    const vfov = viewport.vfovDeg;
    const fingerFrac = spanCanvasFrac(mcp, pip, viewport);
    const depth = depthFromRealWidth(fingerFrac, RING_FINGER_LENGTH_MM * MM, viewport, vfov);

    const wristW = landmarkToWorld(wrist, viewport, depth, vfov);
    const mcpW = landmarkToWorld(mcp, viewport, depth, vfov);
    const pipW = landmarkToWorld(pip, viewport, depth, vfov);
    const dipW = landmarkToWorld(dip, viewport, depth, vfov);
    const tipW = landmarkToWorld(tip, viewport, depth, vfov);
    const indexW = landmarkToWorld(indexMcp, viewport, depth, vfov);
    const pinkyW = landmarkToWorld(pinkyMcp, viewport, depth, vfov);
    const sitW = landmarkToWorld(sit, viewport, depth, vfov);

    const along = normalize3({
      x: pipW.x - mcpW.x,
      y: pipW.y - mcpW.y,
      z: pipW.z - mcpW.z,
    });

    const acrossRaw = { x: indexW.x - pinkyW.x, y: indexW.y - pinkyW.y, z: indexW.z - pinkyW.z };
    let xAxis = normalize3(cross3(acrossRaw, along));
    if (Math.hypot(xAxis.x, xAxis.y, xAxis.z) < 0.2) {
      xAxis = normalize3(cross3({ x: 0, y: 0, z: 1 }, along));
    }
    const yAxis = normalize3(cross3(along, xAxis));
    xAxis = normalize3(cross3(yAxis, along));
    const basis = { x: xAxis, y: yAxis, z: along };

    const innerMm = product.innerDiameterMm ?? RING_INNER_MM;
    let fingerRadiusMm = innerMm * 0.5;
    if (hand.worldLandmarks && hand.worldLandmarks.length > 16) {
      const wm = getLm(hand.worldLandmarks, HAND_LM.ringMcp);
      const wp = getLm(hand.worldLandmarks, HAND_LM.ringPip);
      const lenM = Math.hypot(wp.x - wm.x, wp.y - wm.y, wp.z - wm.z);
      fingerRadiusMm = clamp(lenM * 1000 * 0.38, 7.2, 11.5);
    } else {
      const acrossM = Math.hypot(indexW.x - pinkyW.x, indexW.y - pinkyW.y, indexW.z - pinkyW.z);
      fingerRadiusMm = clamp((acrossM / 0.08) * 8.6, 7.2, 11.5);
    }

    const off = calibration.positionOffset;
    const ao = product.anchorOffset;
    const point = offsetWorld(sitW, off.x + ao.x, off.y + ao.y, off.z + ao.z, basis);
    const modelInnerRadiusMm = innerMm * 0.5;
    const band = product.bandWidthMm ?? product.depthMm ?? 2.3;
    const stone = product.stoneHeightMm ?? 0;
    const ppm = (fingerRadiusMm / modelInnerRadiusMm) * MM * (1 + stone * 0.01) * (band / Math.max(band, 1));

    const midOcc = {
      x: (mcpW.x + pipW.x) * 0.5,
      y: (mcpW.y + pipW.y) * 0.5,
      z: (mcpW.z + pipW.z) * 0.5,
    };
    const fingerLenMm = Math.hypot(pipW.x - mcpW.x, pipW.y - mcpW.y, pipW.z - mcpW.z) * 1000;
    const span = spanCanvasFrac(mcp, pip, viewport);
    const confidence = clamp(0.35 + span * 2.8, 0.2, 0.98);

    return {
      mode: "single",
      left: point,
      right: point,
      point,
      pose: {
        yaw: Math.atan2(along.x, -along.z),
        pitch: Math.asin(clamp(-along.y, -1, 1)),
        roll: Math.atan2(yAxis.x, yAxis.y),
        scale: ppm * calibration.scaleMultiplier,
      },
      quaternion: quatFromBasis(basis),
      basis,
      pixelsPerMm: ppm,
      visible: true,
      confidence,
      occluder: {
        origin: midOcc,
        axis: along,
        radiusMm: fingerRadiusMm * 0.96,
        lengthMm: clamp(fingerLenMm * 1.05, 16, 36),
      },
      debug: [
        { id: "wrist", label: "WRIST", point: wristW, color: "#7dd3fc" },
        { id: "mcp", label: "RING MCP", point: mcpW, color: "#f472b6" },
        { id: "pip", label: "PIP", point: pipW, color: "#fbbf24" },
        { id: "dip", label: "DIP", point: dipW, color: "#34d399" },
        { id: "tip", label: "TIP", point: tipW, color: "#a78bfa" },
        { id: "sit", label: "RING", point, color: "#f5d07a" },
      ],
    };
  }
}
