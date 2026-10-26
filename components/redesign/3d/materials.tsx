"use client";

import type { ComponentProps } from "react";

type Physical = ComponentProps<"meshStandardMaterial">;

export function ChromeMaterial({
  color = "#d5dbe6",
  roughness = 0.28,
  ...props
}: Physical & { color?: string; roughness?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.62}
      roughness={roughness}
      envMapIntensity={0.8}
      emissive="#3a3f55"
      emissiveIntensity={0.18}
      {...props}
    />
  );
}

export function GoldMaterial({
  roughness = 0.28,
  ...props
}: Physical & { roughness?: number }) {
  return (
    <meshStandardMaterial
      color="#e0b65a"
      metalness={0.7}
      roughness={roughness}
      emissive="#7a5a18"
      emissiveIntensity={0.22}
      {...props}
    />
  );
}

export function GlassMaterial({
  color = "#b7b3ff",
  ...props
}: Physical & { color?: string; transmission?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.15}
      roughness={0.12}
      transparent
      opacity={0.72}
      emissive="#8b7cff"
      emissiveIntensity={0.35}
      {...props}
    />
  );
}

export function GemMaterial({
  color = "#e8f2ff",
  ...props
}: Physical & { color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.2}
      roughness={0.08}
      emissive="#9ab6ff"
      emissiveIntensity={0.45}
      {...props}
    />
  );
}
