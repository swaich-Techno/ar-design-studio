"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { DessertPlate, Phone, QrTile } from "@/components/redesign/3d/objects";
import { ChromeMaterial, GemMaterial, GoldMaterial } from "@/components/redesign/3d/materials";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { DepthField } from "@/components/redesign/3d/atmosphere";
import {
  appearFromElapsed,
  beatFromElapsed,
  kindFromElapsed,
  AR_START_OFFSET,
  type ArBeatIndex,
  type ArExplainerKind,
} from "@/lib/redesign/ar-beats";
import { rig } from "@/lib/redesign/scroll-rig";

type Live = {
  kind: ArExplainerKind;
  appear: number;
  scan: number;
  spin: number;
  beat: ArBeatIndex;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Corner({ x, z }: { x: number; z: number }) {
  const sx = Math.sign(x) || 1;
  const sz = Math.sign(z) || 1;
  return (
    <group position={[x, 0.01, z]}>
      <mesh position={[sx * 0.07, 0, 0]}>
        <boxGeometry args={[0.14, 0.012, 0.018]} />
        <meshBasicMaterial color="#e8e4ff" />
      </mesh>
      <mesh position={[0, 0, sz * 0.07]}>
        <boxGeometry args={[0.018, 0.012, 0.14]} />
        <meshBasicMaterial color="#e8e4ff" />
      </mesh>
    </group>
  );
}

function TrackingAnchors({ live }: { live: Live }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const strength = Math.max(live.scan, live.appear);
    const pulse = 0.78 + Math.sin(clock.elapsedTime * 4.2) * 0.22 * live.scan;
    ref.current.scale.setScalar(0.94 + strength * 0.08 * pulse);
    ref.current.visible = strength > 0.04;
  });
  return (
    <group ref={ref} position={[0, 0.04, 0]}>
      <Corner x={-0.58} z={-0.4} />
      <Corner x={0.58} z={-0.4} />
      <Corner x={-0.58} z={0.4} />
      <Corner x={0.58} z={0.4} />
    </group>
  );
}

function TrackingDots({ live }: { live: Live }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return { x: Math.cos(a) * 0.72, z: Math.sin(a) * 0.5 };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    const active = live.scan;
    seeds.forEach((p, i) => {
      const on = active > 0.08 && (t * 2.4 + i * 0.35) % 1 > 0.18;
      dummy.position.set(p.x, 0.03, p.z);
      dummy.scale.setScalar(on ? 0.028 + active * 0.012 : 0.001);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 10]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#b7a8ff" />
    </instancedMesh>
  );
}

function PlaneGrid({ live }: { live: Live }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.opacity = live.scan * 0.32;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
      <planeGeometry args={[1.35, 0.95, 6, 4]} />
      <meshBasicMaterial ref={mat} color="#9aa6ff" wireframe transparent opacity={0.2} depthWrite={false} />
    </mesh>
  );
}

function ScanSweep({ live }: { live: Live }) {
  const bar = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!bar.current) return;
    bar.current.position.z = ((clock.elapsedTime * 0.55) % 1) * 0.9 - 0.45;
    const material = bar.current.material as THREE.MeshBasicMaterial;
    material.opacity = live.scan * 0.92;
    bar.current.visible = live.scan > 0.05;
  });
  return (
    <mesh ref={bar} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <planeGeometry args={[1.28, 0.028]} />
      <meshBasicMaterial color="#c9c4ff" transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

function JewelTray() {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.08, 1.12]} />
        <ChromeMaterial color="#c5ccd6" roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <boxGeometry args={[1.38, 0.03, 0.96]} />
        <meshStandardMaterial color="#1c1824" roughness={0.78} metalness={0.12} />
      </mesh>
    </group>
  );
}

function ExplainerRing() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2.18, 0, 0]} castShadow>
        <torusGeometry args={[0.28, 0.05, 24, 72]} />
        <GoldMaterial roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <octahedronGeometry args={[0.09, 0]} />
        <GemMaterial />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.045, 0.065, 0.05, 8]} />
        <GoldMaterial roughness={0.14} />
      </mesh>
    </group>
  );
}

function ScreenHud({ live }: { live: Live }) {
  const product = useRef<THREE.Group>(null);
  const jewel = useRef<THREE.Group>(null);
  const food = useRef<THREE.Group>(null);
  const line = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (product.current) {
      product.current.visible = live.appear > 0.12;
      product.current.scale.setScalar(0.14 + live.appear * 0.1);
      product.current.rotation.y = clock.elapsedTime * 0.55;
    }
    if (jewel.current) jewel.current.visible = live.kind === "jewellery";
    if (food.current) food.current.visible = live.kind === "food";
    if (line.current) {
      line.current.position.y = ((clock.elapsedTime * 0.7) % 1) * 1.28 - 0.64;
      const material = line.current.material as THREE.MeshBasicMaterial;
      material.opacity = live.scan * 0.85;
      line.current.visible = live.scan > 0.08;
    }
  });
  return (
    <group position={[0, 0, 0.046]}>
      <mesh>
        <planeGeometry args={[0.76, 1.64]} />
        <meshStandardMaterial
          color="#120c18"
          roughness={0.22}
          metalness={0.15}
          emissive="#2a1844"
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh ref={line}>
        <planeGeometry args={[0.72, 0.02]} />
        <meshBasicMaterial color="#d7d2ff" transparent opacity={0.8} />
      </mesh>
      <group ref={product} position={[0, -0.08, 0.02]}>
        <group ref={jewel}>
          <ExplainerRing />
        </group>
        <group ref={food} scale={0.7}>
          <DessertPlate />
        </group>
      </group>
    </group>
  );
}

function PlacedProduct({ live }: { live: Live }) {
  const wrap = useRef<THREE.Group>(null);
  const jewel = useRef<THREE.Group>(null);
  const food = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!wrap.current) return;
    const appear = live.appear;
    wrap.current.visible = appear > 0.03;
    const lift = live.kind === "food" ? 0.08 : 0.14;
    wrap.current.position.y = THREE.MathUtils.lerp(0.42, lift, appear);
    wrap.current.scale.setScalar(Math.max(0.001, THREE.MathUtils.smootherstep(appear, 0, 1)));
    wrap.current.rotation.y += delta * 0.7 * live.spin;
    if (jewel.current) {
      jewel.current.visible = live.kind === "jewellery";
      jewel.current.scale.setScalar(1);
    }
    if (food.current) {
      food.current.visible = live.kind === "food";
      food.current.scale.setScalar(0.62);
    }
  });
  return (
    <group ref={wrap} position={[0, 0.14, 0]}>
      <group ref={jewel}>
        <ExplainerRing />
      </group>
      <group ref={food}>
        <DessertPlate />
      </group>
    </group>
  );
}

function MarkerQr({ live }: { live: Live }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const show = live.scan > 0.35 && live.appear < 0.55;
    ref.current.visible = show;
    ref.current.scale.setScalar(0.38 * Math.max(live.scan, 0.001));
  });
  return (
    <group ref={ref} position={[0, 0.06, 0.02]} rotation={[-Math.PI / 2.05, 0, 0]}>
      <QrTile />
    </group>
  );
}

export function ArExplainerWorld({
  lockKind = null,
}: {
  lockKind?: ArExplainerKind | null;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const live = useMemo<Live>(
    () => ({ kind: "jewellery", appear: reduced ? 1 : 0, scan: reduced ? 0.15 : 1, spin: reduced ? 0.15 : 0, beat: 1 }),
    [reduced],
  );
  const lockRef = useRef(lockKind);
  lockRef.current = lockKind;
  const root = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    const elapsed = reduced ? 4.2 : clock.elapsedTime + AR_START_OFFSET;
    const locked = lockRef.current;
    const kind = reduced ? locked ?? "jewellery" : kindFromElapsed(elapsed, locked);
    const beat = reduced ? 1 : beatFromElapsed(elapsed);
    const appear = reduced ? 1 : appearFromElapsed(elapsed);
    live.kind = kind;
    live.beat = beat;
    live.appear = appear;
    live.scan = reduced ? 0.15 : beat === 0 ? 1 : beat === 1 ? 1 - appear : 0.12;
    live.spin = reduced ? 0.15 : beat === 2 ? 1 : appear * 0.35;

    if (phone.current) {
      phone.current.position.y = 0.42 + Math.sin(clock.elapsedTime * 0.7) * 0.025;
      phone.current.rotation.y = -0.42 + rig.px * 0.12;
      phone.current.rotation.x = -0.16 + rig.py * -0.06;
    }
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, rig.px * 0.18, 0.06);
    }

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, 0.12 + rig.px * 0.22, 0.07);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0.92 + rig.py * -0.12, 0.07);
    cam.position.z = 3.05;
    cam.fov = 34;
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0.02, 0);
  });

  return (
    <>
      <StudioLights accent="#8b7cff" warm="#f0d7a4" />
      <DepthField color="#8b7cff" count={16} radius={2.05} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0.08]} receiveShadow>
        <circleGeometry args={[2.05, 48]} />
        <meshStandardMaterial color="#121014" metalness={0.35} roughness={0.48} />
      </mesh>
      <group ref={root}>
        <JewelTray />
        <PlaneGrid live={live} />
        <ScanSweep live={live} />
        <TrackingAnchors live={live} />
        <TrackingDots live={live} />
        <MarkerQr live={live} />
        <PlacedProduct live={live} />
        <group ref={phone} position={[0.78, 0.42, -0.42]} rotation={[-0.16, -0.42, 0.04]} scale={0.82}>
          <Phone scale={1} screenColor="#120c18" />
          <group position={[0, 0, 0.006]}>
            <ScreenHud live={live} />
          </group>
        </group>
      </group>
      <ContactShadows position={[0, -0.7, 0]} opacity={0.42} scale={5.5} blur={2.2} far={2.8} />
    </>
  );
}
