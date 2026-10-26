import type { JewelleryCategory } from "../types";
import type { JewelleryAnchor } from "./types";
import { EarringAnchor } from "./EarringAnchor";
import { NoseAnchor } from "./NoseAnchor";
import { TikkaAnchor } from "./TikkaAnchor";
import { RingAnchor } from "./RingAnchor";
import { WristAnchor } from "./WristAnchor";
import { NecklaceAnchor } from "./NecklaceAnchor";

export {
  EarringAnchor,
  NoseAnchor,
  TikkaAnchor,
  RingAnchor,
  WristAnchor,
  NecklaceAnchor,
};

const necklace = new NecklaceAnchor();

const registry: Record<JewelleryCategory, JewelleryAnchor> = {
  earring: new EarringAnchor(),
  nose: new NoseAnchor(),
  tikka: new TikkaAnchor(),
  ring: new RingAnchor(),
  bangle: new WristAnchor(),
  necklace,
  pendant: necklace,
};

export function getAnchor(category: JewelleryCategory): JewelleryAnchor | null {
  return registry[category] ?? null;
}

export function implementedCategories(): JewelleryCategory[] {
  return (Object.keys(registry) as JewelleryCategory[]).filter((key) => registry[key].implemented);
}
