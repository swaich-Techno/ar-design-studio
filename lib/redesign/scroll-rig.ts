"use client";

type SectionKey = "hero" | "ar" | "jewel" | "food";

export const rig = {
  hero: 0,
  ar: 0,
  jewel: 0,
  food: 0,
  px: 0,
  py: 0,
};

const target = {
  hero: 0,
  ar: 0,
  jewel: 0,
  food: 0,
  px: 0,
  py: 0,
};

function sectionProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  return Math.min(1, Math.max(0, -rect.top / travel));
}

export function bindSectionScroll(el: HTMLElement, key: SectionKey) {
  const onScroll = () => {
    target[key] = sectionProgress(el);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

export function tickRig(delta: number) {
  const k = 1 - Math.exp(-delta * 5.2);
  const pk = 1 - Math.exp(-delta * 4.4);
  rig.hero += (target.hero - rig.hero) * k;
  rig.ar += (target.ar - rig.ar) * k;
  rig.jewel += (target.jewel - rig.jewel) * k;
  rig.food += (target.food - rig.food) * k;
  rig.px += (target.px - rig.px) * pk;
  rig.py += (target.py - rig.py) * pk;
}

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (event) => {
      target.px = event.clientX / window.innerWidth - 0.5;
      target.py = event.clientY / window.innerHeight - 0.5;
    },
    { passive: true },
  );

  let last = performance.now();
  const loop = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    tickRig(delta);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
