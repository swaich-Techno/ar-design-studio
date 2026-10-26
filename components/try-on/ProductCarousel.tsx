"use client";

import type { TryOnProduct } from "@/lib/try-on/types";
import { cn } from "@/lib/redesign/utils";

export function ProductCarousel({
  products,
  currentId,
  onSelect,
}: {
  products: readonly TryOnProduct[];
  currentId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((item) => {
        const active = item.id === currentId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "min-w-[76px] shrink-0 overflow-hidden rounded-2xl border text-left",
              active ? "border-[var(--gold)] bg-white/10" : "border-white/15 bg-black/35",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.thumbUrl} alt="" className="h-16 w-full object-cover" />
            <span className="block max-w-[88px] truncate px-2 py-1.5 text-[10px] uppercase tracking-[0.12em]">
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
