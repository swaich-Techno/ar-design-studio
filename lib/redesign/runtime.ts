export function isArHost(host: string | null) {
  if (!host) return false;
  const h = host.split(":")[0].toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.startsWith("ar.") ||
    h.includes("ar.bsocio") ||
    h.includes("ar-design-studio") ||
    h.includes("b-socio-ar")
  );
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

export function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function sceneDpr(): [number, number] {
  if (typeof window === "undefined") return [1, 1.5];
  const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  return mobile ? [1, 1.2] : [1, 1.75];
}
