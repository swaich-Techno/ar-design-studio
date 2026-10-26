"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/redesign/utils";
import { CanvasErrorBoundary } from "@/components/redesign/3d/canvas-error";
import { OrbitFallback } from "@/components/redesign/3d/fallbacks";
import { hasWebGL, prefersReducedMotion, sceneDpr } from "@/lib/redesign/runtime";

function useClientFlag(read: () => boolean) {
  return useSyncExternalStore(() => () => {}, read, () => false);
}

function isSoftwareGL(gl: THREE.WebGLRenderer) {
  const ctx = gl.getContext();
  const ext = ctx.getExtension("WEBGL_debug_renderer_info");
  if (!ext) return false;
  const name = String(ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "");
  return /swiftshader|llvmpipe|software|microsoft basic|virtualbox|angel/i.test(name);
}

export function SceneCanvas({
  children,
  className,
  fallback,
  camera = { position: [0, 0.15, 4.7], fov: 30 },
  pauseOffscreen = false,
  dpr,
  frameloop,
  ...props
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  pauseOffscreen?: boolean;
} & Omit<ComponentProps<typeof Canvas>, "children">) {
  const live = useClientFlag(() => true);
  const glOk = useClientFlag(() => hasWebGL());
  const [gpu, setGpu] = useState<"css" | "gl">("css");
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(!pauseOffscreen);
  const visual = fallback ?? <OrbitFallback />;
  const dprValue = dpr ?? (pauseOffscreen && live ? sceneDpr() : ([1, 1.5] as [number, number]));

  useEffect(() => {
    if (!pauseOffscreen) return;
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "140px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pauseOffscreen]);

  const reduced = live && prefersReducedMotion();
  const loop =
    frameloop ??
    (reduced ? "demand" : pauseOffscreen ? (onScreen ? "always" : "never") : "always");

  return (
    <div ref={wrap} className={cn("relative h-full min-h-[12rem] w-full", className)}>
      <div
        className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500"
        style={{ opacity: gpu === "gl" ? 0 : 1 }}
      >
        {visual}
      </div>
      {live && glOk ? (
        <CanvasErrorBoundary fallback={null}>
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={dprValue}
            camera={camera}
            frameloop={loop}
            onCreated={({ gl, invalidate }) => {
              gl.setClearColor(0x000000, 0);
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.18;
              if (!isSoftwareGL(gl)) setGpu("gl");
              if (reduced) invalidate();
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: gpu === "gl" ? 2 : 0,
              width: "100%",
              height: "100%",
              display: "block",
              background: "transparent",
              mixBlendMode: gpu === "gl" ? "normal" : "screen",
            }}
            {...props}
          >
            {children}
          </Canvas>
        </CanvasErrorBoundary>
      ) : null}
    </div>
  );
}
