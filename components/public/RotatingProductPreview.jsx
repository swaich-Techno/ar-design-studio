"use client";

import { useState } from "react";
import { Box } from "lucide-react";

export function RotatingProductPreview({ product }) {
  const previewImage = product.stitchedPreviewImageUrl || product.imageUrl || product.fabricImageUrl;
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  function move(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * -28;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 34;
    setRotation({ x, y });
  }

  function reset() {
    setRotation({ x: 0, y: 0 });
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div
        className="grid min-h-[360px] cursor-grab place-items-center bg-[radial-gradient(circle_at_top,#ecfeff,#f8fafc_55%,#e2e8f0)] p-7"
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div style={{ perspective: "1200px" }} className="w-full max-w-sm">
          <div
            className="relative aspect-[4/5] rounded-[30px] border border-white/80 bg-white p-4 shadow-2xl transition-transform duration-150"
            style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
          >
            <div className="absolute -right-4 top-8 h-24 w-5 rounded-r-2xl bg-slate-300/80" />
            <div className="absolute -bottom-4 left-8 h-5 w-[75%] rounded-b-2xl bg-slate-300/80" />
            {previewImage ? (
              <img src={previewImage} alt={`${product.name} product preview`} loading="lazy" decoding="async" className="h-full w-full rounded-[22px] object-cover" />
            ) : (
              <div className="grid h-full place-items-center rounded-[22px] bg-slate-100 text-center">
                <div>
                  <Box className="mx-auto text-brand" size={44} />
                  <p className="mt-3 font-black">Image preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Box className="text-brand" />
          <p className="font-black">{product.stitchedPreviewImageUrl ? "Stitched rotating preview" : "Rotating image preview"}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Drag the product image to rotate this preview. True camera AR and full 3D rotation need a real .glb/.usdz model file.
        </p>
      </div>
    </div>
  );
}
