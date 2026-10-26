"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import {
  Aperture,
  BrowserPanel,
  CentralOrbitCore,
  GoldRing,
  MessageBubble,
  Phone,
  PlayTile,
  QrTile,
  ScanPlane,
} from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { DepthField, RimGlow } from "@/components/redesign/3d/atmosphere";
import { rig } from "@/lib/redesign/scroll-rig";

function OrbitPath({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh rotation={[Math.PI / 2.45, 0.16, 0.1]}>
      <torusGeometry args={[radius, 0.01, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.38} />
    </mesh>
  );
}

function Satellite({
  children,
  radius,
  speed,
  phase,
}: {
  children: ReactNode;
  radius: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const spread = rig.hero;
    const t = performance.now() * 0.001 * speed + phase;
    const r = radius + spread * 1.55;
    if (!ref.current) return;
    ref.current.position.set(
      Math.cos(t) * r,
      Math.sin(t * 0.62) * (0.28 + spread * 0.55),
      Math.sin(t) * r * 0.92,
    );
    ref.current.lookAt(0, 0.08, 0);
    const s = 0.78 + spread * 0.18;
    ref.current.scale.setScalar(s);
  });
  return <group ref={ref}>{children}</group>;
}

export function OrbitWorld() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    const p = rig.hero;
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.12 + p * 0.55;
      group.current.rotation.x = p * -0.12;
      group.current.position.y = THREE.MathUtils.lerp(0.08, 0.22, p);
      group.current.scale.setScalar(1.28 + p * 0.22);
    }
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, rig.px * 1.15, 0.07);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0.18 + rig.py * -0.42 + p * 0.28, 0.07);
    cam.position.z = THREE.MathUtils.lerp(4.55, 3.35, p);
    cam.fov = THREE.MathUtils.lerp(30, 24, p);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0.06, 0);
  });

  return (
    <>
      <StudioLights />
      <RimGlow />
      <DepthField count={48} radius={3.8} />
      <group ref={group}>
        <Float speed={1.05} rotationIntensity={0.18} floatIntensity={0.32}>
          <CentralOrbitCore />
        </Float>
        <OrbitPath radius={1.95} color="#8b7cff" />
        <OrbitPath radius={2.62} color="#c9cfd8" />
        <Satellite radius={2.05} speed={0.34} phase={0.2}>
          <Phone scale={0.62} />
        </Satellite>
        <Satellite radius={2.28} speed={-0.2} phase={1.4}>
          <BrowserPanel />
        </Satellite>
        <Satellite radius={2.5} speed={0.16} phase={2.5}>
          <Aperture />
        </Satellite>
        <Satellite radius={1.88} speed={-0.26} phase={3.4}>
          <QrTile />
        </Satellite>
        <Satellite radius={2.66} speed={0.18} phase={4.2}>
          <PlayTile />
        </Satellite>
        <Satellite radius={2.18} speed={-0.14} phase={5.1}>
          <GoldRing scale={0.62} />
        </Satellite>
        <Satellite radius={1.72} speed={0.24} phase={0.8}>
          <MessageBubble />
        </Satellite>
        <Satellite radius={2.78} speed={0.11} phase={1.9}>
          <group rotation={[-0.4, 0.2, 0]} scale={0.46}>
            <ScanPlane />
          </group>
        </Satellite>
      </group>
      <ContactShadows position={[0, -1.32, 0]} opacity={0.38} scale={8} blur={2.4} far={3.5} />
    </>
  );
}
