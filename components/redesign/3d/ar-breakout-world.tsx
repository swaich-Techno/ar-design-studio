"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Phone, GoldRing, DessertPlate, ScanPlane } from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

export function ArBreakoutWorld({ hoverRef }: { hoverRef: MutableRefObject<boolean> }) {
  const phone = useRef<THREE.Group>(null);
  const product = useRef<THREE.Group>(null);
  const grid = useRef<THREE.Mesh>(null);
  const reduced = prefersReducedMotion();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const hover = hoverRef.current ? 1 : 0;
    const cycle = reduced ? 0 : (Math.sin(t * 0.28) + 1) / 2;
    const emerge = reduced ? 0.72 : 0.2 + cycle * 0.8;
    const food = !reduced && (t % 14 > 7) ? 1 : 0;

    if (phone.current) {
      phone.current.rotation.set(0.22 + hover * 0.06, -0.38 - hover * 0.08, -0.1);
      phone.current.position.set(-0.15, -0.12, 0);
    }
    if (product.current) {
      const lift = THREE.MathUtils.lerp(0.08, 0.55 + hover * 0.18, emerge);
      product.current.position.set(0.12, lift, 0.42 + hover * 0.16);
      product.current.rotation.y = reduced ? 0.3 : t * 0.35;
      product.current.children.forEach((child, i) => {
        child.visible = i === 0 ? food < 0.5 : food >= 0.5;
      });
    }
    if (grid.current) {
      (grid.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + hover * 0.16;
    }
  });

  return (
    <>
      <StudioLights accent="#8b7cff" warm="#e8d5a3" />
      <mesh ref={grid} rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -0.72, 0.2]}>
        <planeGeometry args={[2.4, 2.4, 10, 10]} />
        <meshBasicMaterial color="#b7a8ff" wireframe transparent opacity={0.1} />
      </mesh>
      <group ref={phone} scale={0.72}>
        <Phone screenColor="#120e18" />
        <group position={[0, 0, 0.08]} scale={0.42}>
          <ScanPlane width={1.4} height={2.1} color="#c9c4ff" />
        </group>
      </group>
      <group ref={product}>
        <group scale={0.42}>
          <GoldRing />
        </group>
        <group scale={0.48} position={[0, -0.12, 0]}>
          <DessertPlate />
        </group>
      </group>
    </>
  );
}
