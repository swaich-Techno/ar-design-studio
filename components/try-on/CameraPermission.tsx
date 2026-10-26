"use client";

import { Button } from "@/components/redesign/ui/button";
import { tryOnHint, tryOnModeLabel } from "@/lib/try-on/catalog";
import type { TryOnProduct } from "@/lib/try-on/types";

export function CameraPermission({
  onAllow,
  onView3d,
  busy,
  error,
  product,
}: {
  onAllow: () => void;
  onView3d: () => void;
  busy?: boolean;
  error?: string | null;
  product: TryOnProduct;
}) {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-[#080809] px-6 text-center text-[var(--fg)]">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--gold)]">{tryOnModeLabel(product)}</p>
      <h1 className="headline mt-4 max-w-[16ch] text-[clamp(2.2rem,8vw,3.6rem)]">{product.name}</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        Virtual Try-On — Beta. We use your camera only. The video stays real — jewellery is drawn on top. Nothing is uploaded. {tryOnHint(product)}.
      </p>
      {error ? <p className="mt-4 max-w-md text-sm text-[var(--gold)]">{error}</p> : null}
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button type="button" variant="gold" size="lg" onClick={onAllow} disabled={busy}>
          {busy ? "Opening camera…" : "Allow camera"}
        </Button>
        <Button type="button" variant="ghost" onClick={onView3d}>
          View in 3D instead
        </Button>
      </div>
      <p className="mt-8 max-w-sm text-xs text-muted">
        If permission is blocked, use the browser address bar to allow the camera, or keep rotating the piece in 3D.
      </p>
    </div>
  );
}
