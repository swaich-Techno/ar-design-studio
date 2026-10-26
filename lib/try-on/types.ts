export type JewelleryCategory =
  | "earring"
  | "nose"
  | "tikka"
  | "ring"
  | "bangle"
  | "necklace"
  | "pendant";

export type AnchorType = "ears" | "nose" | "forehead" | "finger" | "wrist" | "neck";

export type OverlayKind = "model" | "volume";

export type TryOnAssetKind = "glb" | "image" | "missing";

export type Vec3 = { x: number; y: number; z: number };

export type Quat = { x: number; y: number; z: number; w: number };

export type MetalFinish = "gold" | "silver";

export type TryOnProduct = {
  id: string;
  name: string;
  sku: string;
  category: JewelleryCategory;
  /** @deprecated Use tryOnModelUrl. Kept so older loaders still compile. */
  modelUrl: string;
  modelUrlRight?: string;
  /** Production try-on GLB. Empty string = no 3D try-on mesh. */
  tryOnModelUrl: string;
  /** True-alpha PNG/WebP. Never a catalogue card. Empty = no 2D prototype. */
  tryOnImageUrl: string;
  /** @deprecated Use tryOnImageUrl. */
  tryOnAssetUrl?: string;
  /** Catalogue photo — never drawn in the try-on renderer. */
  displayImageUrl: string;
  thumbUrl: string;
  image: string;
  glb: string;
  usdz: string;
  price: string;
  description: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  innerDiameterMm?: number;
  outerDiameterMm?: number;
  bandWidthMm?: number;
  stoneHeightMm?: number;
  anchorType: AnchorType;
  overlayKind: OverlayKind;
  scaleMultiplier: number;
  positionOffset: Vec3;
  rotationOffset: Vec3;
  leftRightAdjustment: Vec3;
  anchorOffset: Vec3;
  metal?: MetalFinish;
  demo: true;
};

export type DebugMode = "off" | "1" | "anchors";

export type CalibrationOverride = {
  scaleMultiplier?: number;
  positionOffset?: Partial<Vec3>;
  rotationOffset?: Partial<Vec3>;
  leftRightAdjustment?: Partial<Vec3>;
  /** Ring sit position along MCP→PIP. Default 0.35. */
  fingerT?: number;
};

export type ResolvedCalibration = {
  scaleMultiplier: number;
  positionOffset: Vec3;
  rotationOffset: Vec3;
  leftRightAdjustment: Vec3;
  fingerT: number;
};

export type Landmark = { x: number; y: number; z: number; visibility?: number };

export type HeadPose = {
  yaw: number;
  pitch: number;
  roll: number;
  scale: number;
};

export type FaceFrame = {
  landmarks: Landmark[];
  pose: HeadPose;
  matrix: Float32Array | null;
  timestamp: number;
};

export type HandFrame = {
  landmarks: Landmark[];
  worldLandmarks: Landmark[] | null;
  handedness: "Left" | "Right" | "Unknown";
  timestamp: number;
};

export type PoseFrame = {
  landmarks: Landmark[];
  timestamp: number;
};

export type TrackingSnapshot = {
  face: FaceFrame | null;
  hand: HandFrame | null;
  pose: PoseFrame | null;
};

export type TrackerNeed = {
  face: boolean;
  hand: boolean;
  pose: boolean;
};

/** World-space metres in the Three.js camera frame (Y up, camera at origin looking −Z). */
export type ScreenPoint = {
  x: number;
  y: number;
  z: number;
};

export type DebugLandmark = {
  id: string;
  label: string;
  point: ScreenPoint;
  color: string;
};

export type EarAnchor = {
  left: ScreenPoint;
  right: ScreenPoint;
  pose: HeadPose;
  pixelsPerMm: number;
  visible: boolean;
};

export type OverlayAnchor = EarAnchor & {
  mode: "pair" | "single";
  point: ScreenPoint;
  quaternion?: Quat;
  basis?: { x: Vec3; y: Vec3; z: Vec3 };
  chain?: {
    left: ScreenPoint;
    pendant: ScreenPoint;
    right: ScreenPoint;
  };
  occluder?: {
    origin: ScreenPoint;
    axis: Vec3;
    radiusMm: number;
    lengthMm: number;
  };
  confidence?: number;
  debug?: DebugLandmark[];
};

export type ViewportMap = {
  canvasWidth: number;
  canvasHeight: number;
  contentX: number;
  contentY: number;
  contentW: number;
  contentH: number;
  mirrored: boolean;
  vfovDeg: number;
};

export type TrackerStatus = "idle" | "loading" | "ready" | "unsupported" | "error";

export type CameraFacing = "user" | "environment";

export function trackersFor(anchor: AnchorType): TrackerNeed {
  if (anchor === "finger" || anchor === "wrist") return { face: false, hand: true, pose: false };
  if (anchor === "neck") return { face: true, hand: false, pose: true };
  return { face: true, hand: false, pose: false };
}
