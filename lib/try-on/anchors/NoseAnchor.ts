import type { JewelleryAnchor } from "./types";

/** Phase 2 stub — nose pins. */
export class NoseAnchor implements JewelleryAnchor {
  readonly category = "nose" as const;
  readonly implemented = false;
  compute() {
    return null;
  }
}
