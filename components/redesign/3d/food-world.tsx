"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Burger, DessertPlate, Mocktail, Phone } from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { DepthField, RimGlow } from "@/components/redesign/3d/atmosphere";
import { rig } from "@/lib/redesign/scroll-rig";

export function FoodWorld({
  dish = "lava",
}: {
  dish?: "lava" | "burger" | "mocktail";
}) {
  const plate = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  const garnish = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const progress = rig.food;
    const split = Math.min(1, progress / 0.45);
    const show = Math.max(0, (progress - 0.38) / 0.4);
    if (plate.current) {
      plate.current.position.y = -0.08 - split * 0.28;
      plate.current.rotation.y = t * 0.12 + rig.px * 0.35;
      plate.current.scale.setScalar(1.32);
    }
    if (top.current) {
      top.current.position.y = split * 0.62;
      top.current.rotation.y = t * 0.18;
    }
    if (garnish.current) {
      garnish.current.position.set(split * 0.78, 0.22 + split * 0.28, split * 0.45);
    }
    if (phone.current) {
      phone.current.position.set(0, -0.18, THREE.MathUtils.lerp(3.2, 0.15, show));
      phone.current.visible = show > 0.04;
    }
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, rig.px * 0.75, 0.07);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0.28 + rig.py * -0.28, 0.07);
    cam.position.z = THREE.MathUtils.lerp(4.45, 3.5, progress);
    cam.fov = THREE.MathUtils.lerp(30, 25, progress);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0.08, 0);
  });

  return (
    <>
      <StudioLights accent="#c44536" warm="#f0c48a" />
      <RimGlow color="#c44536" />
      <DepthField color="#c44536" count={26} radius={3.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]}>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#3a181c" metalness={0.28} roughness={0.38} />
      </mesh>
      <group ref={plate}>
        {dish === "burger" ? <Burger /> : dish === "mocktail" ? <Mocktail /> : <DessertPlate />}
      </group>
      <group ref={top}>
        <mesh position={[0.05, 0.42, 0.08]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#8b1e2d" />
        </mesh>
      </group>
      <group ref={garnish}>
        <mesh rotation={[0.6, 0.2, 0.4]}>
          <boxGeometry args={[0.16, 0.02, 0.07]} />
          <meshStandardMaterial color="#2f6b45" />
        </mesh>
        <mesh position={[0.2, -0.1, 0]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#d4783a" />
        </mesh>
      </group>
      <group ref={phone}>
        <Phone scale={1.22} screenColor="#2a1014" />
      </group>
      <ContactShadows position={[0, -1.06, 0]} opacity={0.45} scale={8} blur={2.5} far={3.5} />
    </>
  );
}
