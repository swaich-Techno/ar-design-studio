"use client";

type PointerState = {
  x: number;
  y: number;
  nx: number;
  ny: number;
};

export const pointer: PointerState = {
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
};

export const scrollState = {
  y: 0,
  hero: 0,
  arHero: 0,
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.nx = event.clientX / window.innerWidth - 0.5;
      pointer.ny = event.clientY / window.innerHeight - 0.5;
    },
    { passive: true },
  );
}

export function bindLocalPointer(el: HTMLElement, reduced = false) {
  const move = (event: PointerEvent) => {
    if (reduced) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
  };
  const leave = () => {
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };
  el.addEventListener("pointermove", move, { passive: true });
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}
