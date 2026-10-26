"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Mote = {
  a: number;
  r: number;
  y: number;
  s: number;
  speed: number;
  zBias: number;
};

export function DepthField({
  color = "#8b7cff",
  count = 42,
  radius = 3.4,
}: {
  color?: string;
  count?: number;
  radius?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo<Mote[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        a: i * 1.618,
        r: radius * (0.35 + (i % 9) * 0.08),
        y: ((i % 7) - 3) * 0.42,
        s: 0.028 + (i % 5) * 0.018,
        speed: 0.07 + (i % 6) * 0.025,
        zBias: ((i % 4) - 1.5) * 0.55,
      })),
    [count, radius],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((p, i) => {
      dummy.position.set(
        Math.cos(t * p.speed + p.a) * p.r,
        p.y + Math.sin(t * p.speed * 0.85 + p.a) * 0.28,
        Math.sin(t * p.speed + p.a) * p.r * 0.62 + p.zBias,
      );
      dummy.scale.setScalar(p.s);
      dummy.rotation.set(t * 0.22 + p.a, t * 0.16, t * 0.1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.22}
        metalness={0.72}
        emissive={color}
        emissiveIntensity={0.22}
      />
    </instancedMesh>
  );
}

export function RimGlow({ color = "#8b7cff", scale = 2.6 }: { color?: string; scale?: number }) {
  return (
    <mesh scale={scale} position={[0, 0.1, -0.4]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} />
    </mesh>
  );
}

export function GroundDisc({ color = "#121218" }: { color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <circleGeometry args={[4.2, 64]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.32} />
    </mesh>
  );
}
