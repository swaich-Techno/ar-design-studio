export const AR_BEAT_SECONDS = 3;
export const AR_BEAT_COUNT = 3;
export const AR_CYCLE_SECONDS = AR_BEAT_SECONDS * AR_BEAT_COUNT;
export const AR_KIND_SECONDS = AR_CYCLE_SECONDS * 2;
/** Start in Place so the product is visible on first paint. */
export const AR_START_OFFSET = AR_BEAT_SECONDS + 0.4;

export const arBeats = [
  {
    n: "01",
    title: "Scan",
    body: "The camera finds a real surface — a table, counter, or dining room.",
  },
  {
    n: "02",
    title: "Place",
    body: "A hero dish locks onto that plane, aligned with the room.",
  },
  {
    n: "03",
    title: "Interact",
    body: "Rotate, inspect, then enquire on WhatsApp. No customer app.",
  },
] as const;

export type ArBeatIndex = 0 | 1 | 2;
export type ArExplainerKind = "jewellery" | "food";

export function beatFromElapsed(elapsed: number): ArBeatIndex {
  const cycle = ((elapsed % AR_CYCLE_SECONDS) + AR_CYCLE_SECONDS) % AR_CYCLE_SECONDS;
  return Math.min(2, Math.floor(cycle / AR_BEAT_SECONDS)) as ArBeatIndex;
}

export function kindFromElapsed(elapsed: number, lockKind?: ArExplainerKind | null): ArExplainerKind {
  if (lockKind) return lockKind;
  return "food";
}

export function appearFromElapsed(elapsed: number): number {
  const cycle = ((elapsed % AR_CYCLE_SECONDS) + AR_CYCLE_SECONDS) % AR_CYCLE_SECONDS;
  if (cycle < AR_BEAT_SECONDS) return 0;
  if (cycle < AR_BEAT_SECONDS * 2) return (cycle - AR_BEAT_SECONDS) / AR_BEAT_SECONDS;
  return 1;
}
