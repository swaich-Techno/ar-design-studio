"use client";

import { Button } from "@/components/redesign/ui/button";

export function TryOnControls({
  onScreenshot,
  onFlip,
  onReset,
  onWhatsApp,
  flipAvailable,
  reducedMotion,
}: {
  onScreenshot: () => void;
  onFlip: () => void;
  onReset: () => void;
  onWhatsApp: string;
  flipAvailable?: boolean;
  reducedMotion?: boolean;
}) {
  const motionClass = reducedMotion ? "" : "transition-transform active:scale-[0.98]";
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-3">
      <Button type="button" variant="ghost" size="sm" className={motionClass} onClick={onScreenshot}>
        Screenshot
      </Button>
      {flipAvailable ? (
        <Button type="button" variant="ghost" size="sm" className={motionClass} onClick={onFlip}>
          Flip camera
        </Button>
      ) : null}
      <Button type="button" variant="ghost" size="sm" className={motionClass} onClick={onReset}>
        Reset alignment
      </Button>
      <Button asChild variant="gold" size="sm" className={motionClass}>
        <a href={onWhatsApp} target="_blank" rel="noreferrer">
          WhatsApp enquiry
        </a>
      </Button>
    </div>
  );
}
