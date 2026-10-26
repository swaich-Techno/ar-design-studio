"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { ctaPulse } from "@/lib/redesign/cta-pulse";
import { pointer } from "@/lib/redesign/pointer";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

export function ExperienceCoreWorld() {
  const root = useRef<THREE.Group>(null);
  const ribbons = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const reduced = prefersReducedMotion();
  const enter = useRef(reduced ? 1 : 0);
  const hover = useRef(0);
  const scanOnce = useRef(0);

  useFrame(({ clock, camera }, delta) => {
    hover.current = THREE.MathUtils.damp(hover.current, ctaPulse.hover, 6, delta);
    enter.current = THREE.MathUtils.damp(enter.current, Math.min(1, ctaPulse.scroll * 1.35), 3.2, delta);
    if (ctaPulse.hover > 0.5 && scanOnce.current <= 0) scanOnce.current = 1;
    if (scanOnce.current > 0) scanOnce.current = Math.max(0, scanOnce.current - delta * 0.55);

    const e = enter.current;
    const h = hover.current;
    const t = clock.elapsedTime;

    if (root.current) {
      const rise = THREE.MathUtils.lerp(0.42, 0, e);
      root.current.position.y = reduced ? 0 : rise + Math.sin(t * 0.55) * 0.03;
      const s = THREE.MathUtils.lerp(0.85, 1, e) * (1 + h * 0.03);
      root.current.scale.setScalar(s);
      const enterRot = THREE.MathUtils.lerp(0.26, 0, e);
      const look = reduced ? 0 : THREE.MathUtils.clamp(pointer.nx, -0.5, 0.5) * 0.105;
      root.current.rotation.x = enterRot + (reduced ? 0 : Math.sin(t * 0.4) * 0.03);
      root.current.rotation.y = look;
      root.current.rotation.z = enterRot * 0.4;
    }

    if (ribbons.current && !reduced) {
      ribbons.current.rotation.y += delta * (0.18 + h * 0.12);
      ribbons.current.scale.setScalar(1 + h * 0.03 + e * 0.06);
    }

    if (scan.current) {
      const pass = reduced ? 0.15 : Math.sin(t * 0.55) * 0.55 + (scanOnce.current * 1.1 - 0.55);
      scan.current.position.y = pass;
      const mat = scan.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.28 + h * 0.18 + (scanOnce.current > 0 ? 0.22 : 0);
    }

    if (glass.current) {
      glass.current.emissiveIntensity = 0.16 + h * 0.28;
      glass.current.opacity = 0.55 + h * 0.08;
    }
    if (core.current) core.current.opacity = 0.85 + h * 0.15;

    const cam = camera as THREE.PerspectiveCamera;
    const zoom = reduced ? 0 : e * 0.065;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, 3.55 - zoom * 4.2, 0.05);
    cam.position.x = reduced ? 0.15 : THREE.MathUtils.clamp(pointer.nx, -0.5, 0.5) * 0.12;
    cam.lookAt(0, 0.02, 0);
  });

  return (
    <>
      <StudioLights accent="#8b7cff" warm="#e8e2d4" />
      <group ref={root}>
        <mesh>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial
            ref={glass}
            color="#c9c4e6"
            metalness={0.08}
            roughness={0.1}
            transmission={0.62}
            thickness={0.55}
            ior={1.42}
            transparent
            opacity={0.58}
            emissive="#5a4aa0"
            emissiveIntensity={0.16}
            attenuationColor="#1b1528"
            attenuationDistance={1.4}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshBasicMaterial ref={core} color="#8b7cff" transparent opacity={0.9} />
        </mesh>
        <group ref={ribbons}>
          <mesh rotation={[0.42, 0.2, 0.18]}>
            <torusGeometry args={[1.02, 0.028, 16, 128]} />
            <meshStandardMaterial
              color="#e8e4dc"
              metalness={0.86}
              roughness={0.14}
              emissive="#8a8478"
              emissiveIntensity={0.12}
            />
          </mesh>
          <mesh rotation={[1.22, -0.35, 0.5]}>
            <torusGeometry args={[0.88, 0.018, 12, 128]} />
            <meshPhysicalMaterial
              color="#9aa0b8"
              metalness={0.35}
              roughness={0.12}
              transmission={0.35}
              thickness={0.2}
              transparent
              opacity={0.7}
              emissive="#3a3550"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
        <mesh ref={scan} rotation={[0.12, 0, 0]}>
          <circleGeometry args={[0.78, 48]} />
          <meshPhysicalMaterial
            color="#cbbfff"
            metalness={0.1}
            roughness={0.08}
            transmission={0.4}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            emissive="#8b7cff"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
    </>
  );
}
