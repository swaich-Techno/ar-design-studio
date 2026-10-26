"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { site } from "@/lib/redesign/site";

export function RealQr({
  path,
  url,
  label = "Scan this with your phone to experience the demo.",
}: {
  path?: string;
  url?: string;
  label?: string;
}) {
  const [src, setSrc] = useState("");
  const href = url || `${site.production.arOrigin}${path || ""}`;

  useEffect(() => {
    QRCode.toDataURL(href, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 280,
      color: { dark: "#111111", light: "#ffffff" },
    }).then(setSrc);
  }, [href]);

  return (
    <figure className="mx-auto max-w-[220px] text-center">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`QR code for ${href}`} className="mx-auto w-full rounded-2xl bg-white p-2" />
      ) : (
        <div className="aspect-square w-full rounded-2xl bg-white/10" aria-hidden />
      )}
      <figcaption className="mt-3 text-xs text-muted">{label}</figcaption>
      <a href={href} className="mt-2 block break-all text-[0.65rem] text-muted">
        {href}
      </a>
    </figure>
  );
}
