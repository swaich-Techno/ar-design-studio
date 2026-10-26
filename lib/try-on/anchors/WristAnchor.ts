import type { JewelleryAnchor } from "./types";

/** Phase 3 stub — bangles / bracelets. Needs HandTracker wrist placement. */
export class WristAnchor implements JewelleryAnchor {
  readonly category = "bangle" as const;
  readonly implemented = false;
  compute() {
    return null;
  }
}
