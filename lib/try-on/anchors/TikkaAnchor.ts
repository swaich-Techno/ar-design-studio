import type { JewelleryAnchor } from "./types";

/** Phase 2 stub — maang tikka / forehead. */
export class TikkaAnchor implements JewelleryAnchor {
  readonly category = "tikka" as const;
  readonly implemented = false;
  compute() {
    return null;
  }
}
