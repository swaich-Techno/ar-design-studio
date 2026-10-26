import type { TryOnAssetKind, TryOnProduct, Vec3 } from "./types";

const ZERO: Vec3 = { x: 0, y: 0, z: 0 };

export const TRY_ON_WHATSAPP = "917009464475";

/** Demo earring engine assets. Not listed in live Try On Me. */
export const earringProducts: readonly TryOnProduct[] = [
  {
    id: "gold-hoop",
    name: "Classic Gold Hoop",
    sku: "JW-ERR-01",
    category: "earring",
    modelUrl: "/models/try-on/gold-hoop.glb",
    tryOnModelUrl: "/models/try-on/gold-hoop.glb",
    tryOnImageUrl: "",
    displayImageUrl: "/models/try-on/thumbs/gold-hoop.svg",
    thumbUrl: "/models/try-on/thumbs/gold-hoop.svg",
    image: "/models/try-on/thumbs/gold-hoop.svg",
    glb: "/models/try-on/gold-hoop.glb",
    usdz: "/models/try-on/gold-hoop.glb",
    price: "₹42,000",
    description:
      "A 26 mm yellow-gold hoop with a polished tubular profile. Demo asset for live camera try-on — not a jeweller CAD file.",
    widthMm: 26,
    heightMm: 26,
    depthMm: 2.2,
    anchorType: "ears",
    overlayKind: "model",
    scaleMultiplier: 1,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: 1.5, z: -1 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 2 },
    metal: "gold",
    demo: true,
  },
  {
    id: "pearl-drop",
    name: "Pearl Tear Drop",
    sku: "JW-ERR-02",
    category: "earring",
    modelUrl: "/models/try-on/pearl-drop.glb",
    tryOnModelUrl: "/models/try-on/pearl-drop.glb",
    tryOnImageUrl: "",
    displayImageUrl: "/models/try-on/thumbs/pearl-drop.svg",
    thumbUrl: "/models/try-on/thumbs/pearl-drop.svg",
    image: "/models/try-on/thumbs/pearl-drop.svg",
    glb: "/models/try-on/pearl-drop.glb",
    usdz: "/models/try-on/pearl-drop.glb",
    price: "₹68,000",
    description: "A 32 mm drop: gold hook, slender stem, and an 8 mm cream pearl. Demo asset for live camera try-on.",
    widthMm: 8,
    heightMm: 32,
    depthMm: 8,
    anchorType: "ears",
    overlayKind: "model",
    scaleMultiplier: 1,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: 2, z: -1.2 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 2 },
    metal: "gold",
    demo: true,
  },
  {
    id: "diamond-stud",
    name: "Solitaire Diamond Stud",
    sku: "JW-ERR-03",
    category: "earring",
    modelUrl: "/models/try-on/diamond-stud.glb",
    tryOnModelUrl: "/models/try-on/diamond-stud.glb",
    tryOnImageUrl: "",
    displayImageUrl: "/models/try-on/thumbs/diamond-stud.svg",
    thumbUrl: "/models/try-on/thumbs/diamond-stud.svg",
    image: "/models/try-on/thumbs/diamond-stud.svg",
    glb: "/models/try-on/diamond-stud.glb",
    usdz: "/models/try-on/diamond-stud.glb",
    price: "₹1,15,000",
    description: "A 6.5 mm round brilliant in a six-prong yellow-gold setting. Demo asset for live camera try-on.",
    widthMm: 7,
    heightMm: 7,
    depthMm: 5,
    anchorType: "ears",
    overlayKind: "model",
    scaleMultiplier: 1.05,
    rotationOffset: { x: 12, y: 0, z: 0 },
    positionOffset: { x: 0, y: 0.5, z: -0.6 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 1.5 },
    metal: "gold",
    demo: true,
  },
  {
    id: "jhumka-drop",
    name: "Temple Jhumka",
    sku: "JW-ERR-04",
    category: "earring",
    modelUrl: "/models/try-on/jhumka-drop.glb",
    tryOnModelUrl: "/models/try-on/jhumka-drop.glb",
    tryOnImageUrl: "",
    displayImageUrl: "/models/try-on/thumbs/jhumka-drop.svg",
    thumbUrl: "/models/try-on/thumbs/jhumka-drop.svg",
    image: "/models/try-on/thumbs/jhumka-drop.svg",
    glb: "/models/try-on/jhumka-drop.glb",
    usdz: "/models/try-on/jhumka-drop.glb",
    price: "₹86,000",
    description: "An 18 mm gold jhumka dome with a beaded rim and a hanging pearl. Demo asset for live camera try-on.",
    widthMm: 18,
    heightMm: 28,
    depthMm: 18,
    anchorType: "ears",
    overlayKind: "model",
    scaleMultiplier: 0.98,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: 2.2, z: -1.4 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 2 },
    metal: "gold",
    demo: true,
  },
] as const;

/** The three real jewellery pieces shown in Try On Me. */
export const jewelleryTryOnProducts: readonly TryOnProduct[] = [
  {
    id: "pendant",
    name: "Radiant Pear Halo Pendant",
    sku: "JW-PND-01",
    category: "pendant",
    modelUrl: "/models/try-on/pendant-tryon.glb",
    tryOnModelUrl: "/models/try-on/pendant-tryon.glb",
    tryOnImageUrl: "/models/try-on/radiant-pear-transparent.webp",
    tryOnAssetUrl: "/models/try-on/radiant-pear-transparent.webp",
    displayImageUrl: "/redesign/demo/radiant-pear-halo-pendant.png",
    thumbUrl: "/redesign/demo/radiant-pear-halo-pendant.png",
    image: "/redesign/demo/radiant-pear-halo-pendant.png",
    glb: "/redesign/demo/radiant-pear-halo-pendant.glb",
    usdz: "/redesign/demo/radiant-pear-halo-pendant.usdz",
    price: "₹2,38,000",
    description:
      "A pear-cut diamond in a halo of round brilliants, held by a yellow-gold ribbon. Virtual Try-On — Beta places a 3D pendant at the neck — not a catalogue photo.",
    widthMm: 18,
    heightMm: 42,
    depthMm: 5,
    anchorType: "neck",
    overlayKind: "model",
    scaleMultiplier: 1,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: -8, z: 4 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 3 },
    metal: "gold",
    demo: true,
  },
  {
    id: "ring",
    name: "Infinity Twist Pavé Ring",
    sku: "JW-RNG-01",
    category: "ring",
    modelUrl: "/models/try-on/gold-ring.glb",
    tryOnModelUrl: "/models/try-on/gold-ring.glb",
    tryOnImageUrl: "",
    tryOnAssetUrl: "",
    displayImageUrl: "/redesign/demo/infinity-twist-pave-ring.png",
    thumbUrl: "/redesign/demo/infinity-twist-pave-ring.png",
    image: "/redesign/demo/infinity-twist-pave-ring.png",
    glb: "/models/try-on/gold-ring.glb",
    usdz: "/models/try-on/gold-ring.glb",
    price: "₹3,75,000",
    description: "Infinity-twist pavé ring. Virtual Try-On — Beta wraps a gold band on the ring finger.",
    widthMm: 19.3,
    heightMm: 19.3,
    depthMm: 2.3,
    innerDiameterMm: 17,
    outerDiameterMm: 19.3,
    bandWidthMm: 2.3,
    stoneHeightMm: 2.4,
    anchorType: "finger",
    overlayKind: "model",
    scaleMultiplier: 1,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: 0, z: 0 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 0 },
    metal: "gold",
    demo: true,
  },
  {
    id: "necklace",
    name: "Eternal Bloom Floral Necklace",
    sku: "JW-NCK-01",
    category: "necklace",
    modelUrl: "/models/try-on/necklace-tryon.glb",
    tryOnModelUrl: "/models/try-on/necklace-tryon.glb",
    tryOnImageUrl: "",
    tryOnAssetUrl: "",
    displayImageUrl: "/redesign/demo/eternal-bloom-floral-necklace.png",
    thumbUrl: "/redesign/demo/eternal-bloom-floral-necklace.png",
    image: "/redesign/demo/eternal-bloom-floral-necklace.png",
    glb: "/redesign/demo/eternal-bloom-floral-necklace.glb",
    usdz: "/redesign/demo/eternal-bloom-floral-necklace.usdz",
    price: "₹12,50,000",
    description:
      "Yellow-gold floral necklace. Virtual Try-On — Beta sits a 3D floral centre and chain on the chest — not a catalogue photo.",
    widthMm: 48,
    heightMm: 42,
    depthMm: 6,
    anchorType: "neck",
    overlayKind: "model",
    scaleMultiplier: 1,
    rotationOffset: ZERO,
    positionOffset: { x: 0, y: 6, z: 4 },
    leftRightAdjustment: ZERO,
    anchorOffset: { x: 0, y: 0, z: 3 },
    metal: "gold",
    demo: true,
  },
] as const;

export const tryOnProducts = jewelleryTryOnProducts;

export const defaultTryOnProduct = jewelleryTryOnProducts[0];

const allTryOn = [...jewelleryTryOnProducts, ...earringProducts];

export function findTryOnProduct(id: string | undefined | null) {
  if (!id) return undefined;
  return allTryOn.find((item) => item.id === id);
}

/** Never silently substitute an earring when the id is missing or unknown. */
export function getTryOnProduct(id?: string | null): TryOnProduct {
  return jewelleryTryOnProducts.find((item) => item.id === id) ?? defaultTryOnProduct;
}

export function isJewelleryTryOnId(id: string) {
  return jewelleryTryOnProducts.some((item) => item.id === id);
}

export function isTryOnEarringId(id: string) {
  return earringProducts.some((item) => item.id === id);
}

export function isTryOnProductId(id: string) {
  return Boolean(findTryOnProduct(id));
}

export function tryOnPath(id?: string) {
  return id ? `/ar/try-on/${id}` : "/ar/try-on";
}

export function tryOnEnquireText(product?: TryOnProduct) {
  if (!product) return "Jewellery AR Try On Me enquiry";
  return `Try On Me enquiry: ${product.name} (${product.sku})`;
}

export function tryOnWhatsApp(product?: TryOnProduct) {
  return `https://wa.me/${TRY_ON_WHATSAPP}?text=${encodeURIComponent(tryOnEnquireText(product))}`;
}

export function tryOnModeLabel(product: TryOnProduct) {
  if (product.category === "ring") return "Virtual Try-On — Beta · ring";
  if (product.category === "necklace") return "Virtual Try-On — Beta · necklace";
  if (product.category === "pendant") return "Virtual Try-On — Beta · pendant";
  if (product.category === "earring") return "Virtual Try-On — Beta · earrings";
  return "Virtual Try-On — Beta";
}

/** Strict try-on asset pick. Never returns displayImageUrl or product.image. */
export function resolveTryOnAsset(product: TryOnProduct): { kind: TryOnAssetKind; url: string } {
  const model = (product.tryOnModelUrl || "").trim();
  const image = (product.tryOnImageUrl || "").trim();
  if (model) return { kind: "glb", url: model };
  if (image) return { kind: "image", url: image };
  return { kind: "missing", url: "" };
}

export function tryOnHint(product: TryOnProduct) {
  if (product.anchorType === "finger") return "Hold up your hand — ring finger toward the camera";
  if (product.anchorType === "neck") return "Frame your neck and shoulders";
  return "Look at the camera";
}

export function parseDebugMode(value?: string | null): import("./types").DebugMode {
  if (value === "anchors") return "anchors";
  if (value === "1" || value === "true") return "1";
  return "off";
}

export function isDropEarring(product: TryOnProduct) {
  return product.category === "earring" && product.heightMm > product.widthMm * 1.25;
}
