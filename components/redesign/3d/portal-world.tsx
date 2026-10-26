"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { DessertPlate, GoldRing, Phone, ScanPlane } from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { DepthField, RimGlow } from "@/components/redesign/3d/atmosphere";
import { rig } from "@/lib/redesign/scroll-rig";

export function PortalWorld({ bias = 0 }: { bias?: number }) {
  const phone = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const plane = useRef<THREE.Group>(null);
  const biasRef = useRef(bias);
  biasRef.current = bias;

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const progress = rig.ar;
    const split = Math.min(1, progress / 0.34);
    const come = Math.min(1, Math.max(0, (progress - 0.06) / 0.3));
    const b = biasRef.current;

    if (phone.current) {
      phone.current.position.z = THREE.MathUtils.lerp(phone.current.position.z, come * 1.85, 0.08);
      phone.current.position.y = Math.sin(t * 0.7) * 0.04;
      phone.current.scale.setScalar(THREE.MathUtils.lerp(phone.current.scale.x, 1.42 + come * 0.62, 0.08));
      phone.current.rotation.y = rig.px * 0.42 + t * 0.04;
      phone.current.rotation.x = rig.py * -0.18;
    }
    if (left.current) {
      left.current.position.x = THREE.MathUtils.lerp(-1.85, -2.95, split);
      left.current.position.y = Math.sin(t * 0.7) * 0.1;
      left.current.rotation.y = t * 0.32 + rig.px * 0.35;
      left.current.scale.setScalar(1.15);
      left.current.visible = b >= 0;
    }
    if (right.current) {
      right.current.position.x = THREE.MathUtils.lerp(1.9, 3.05, split);
      right.current.position.y = Math.sin(t * 0.55 + 1) * 0.12;
      right.current.rotation.y = -t * 0.24 + rig.px * 0.22;
      right.current.scale.setScalar(1.12);
      right.current.visible = b <= 0;
    }
    if (plane.current) {
      plane.current.position.x = rig.px * 0.32;
      plane.current.position.y = rig.py * -0.18;
    }

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, rig.px * 0.85 + Math.max(0, b) * 0.28, 0.07);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0.12 + rig.py * -0.32, 0.07);
    cam.position.z = THREE.MathUtils.lerp(4.85, 3.55, come);
    cam.fov = THREE.MathUtils.lerp(29, 24, come);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0.04, 0);
  });

  return (
    <>
      <StudioLights accent={bias < 0 ? "#c44536" : "#8b7cff"} warm={bias > 0 ? "#f0d7a4" : "#f3efe6"} />
      <RimGlow color={bias < 0 ? "#c44536" : "#8b7cff"} />
      <DepthField color={bias < 0 ? "#c44536" : "#8b7cff"} count={40} radius={3.6} />
      <group ref={plane} position={[0, 0, -1.55]} rotation={[-0.16, 0, 0]}>
        <ScanPlane width={3.4} height={4.4} color="#9aa6ff" />
      </group>
      <group ref={phone}>
        <Float speed={1.15} floatIntensity={0.22} rotationIntensity={0.1}>
          <Phone scale={1.28} screenColor="#120c18" />
        </Float>
      </group>
      <group ref={left} position={[-1.85, 0.12, 0.1]}>
        <GoldRing />
      </group>
      <group ref={right} position={[1.9, 0.06, 0.1]}>
        <DessertPlate />
      </group>
      <ContactShadows position={[0, -1.38, 0]} opacity={0.42} scale={9} blur={2.6} far={4} />
    </>
  );
}
