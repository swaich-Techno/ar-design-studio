"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Earring, GoldRing, Necklace, Phone, ScanPlane } from "@/components/redesign/3d/objects";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { DepthField, RimGlow } from "@/components/redesign/3d/atmosphere";
import { rig } from "@/lib/redesign/scroll-rig";

function WipeJewellery() {
  const clip = useRef(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.15));
  const gold = useRef<THREE.MeshStandardMaterial>(null);
  const gem = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const progress = Math.min(1, rig.jewel / 0.5);
    clip.current.constant = THREE.MathUtils.lerp(-0.9, 0.9, progress);
    if (gold.current) gold.current.clippingPlanes = [clip.current];
    if (gem.current) gem.current.clippingPlanes = [clip.current];
  });
  return (
    <group scale={1.22}>
      <mesh rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[0.62, 0.09, 16, 64]} />
        <meshBasicMaterial color="#8a7a5a" wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[0.62, 0.09, 32, 96]} />
        <meshStandardMaterial
          ref={gold}
          color="#e0b65a"
          metalness={0.7}
          roughness={0.28}
          emissive="#7a5a18"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          ref={gem}
          color="#e8f2ff"
          metalness={0.2}
          roughness={0.1}
          emissive="#9ab6ff"
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[0.62, 0.09, 12, 48]} />
        <meshBasicMaterial color="#c9a86c" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function JewelleryWorld({
  piece = "ring",
  interactive = false,
}: {
  piece?: "ring" | "necklace" | "earring";
  interactive?: boolean;
}) {
  const jewel = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const drag = useRef({ down: false });

  useFrame(({ camera, clock, gl }) => {
    const t = clock.elapsedTime;
    const progress = interactive ? 0 : rig.jewel;
    const toPhone = Math.max(0, (progress - 0.52) / 0.4);
    if (jewel.current && !interactive) {
      jewel.current.rotation.y = t * 0.28 + rig.px * 0.45;
      jewel.current.rotation.x = 0.18 + rig.py * 0.2;
      jewel.current.position.z = toPhone * 1.55;
      jewel.current.scale.setScalar(1.28 - toPhone * 0.38);
    }
    if (phone.current) {
      phone.current.position.set(0, -0.12, THREE.MathUtils.lerp(2.9, 0.45, toPhone));
      phone.current.visible = toPhone > 0.05;
    }
    if (!interactive) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.position.x = THREE.MathUtils.lerp(cam.position.x, rig.px * 0.7, 0.07);
      cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0.22 + rig.py * -0.25, 0.07);
      cam.position.z = THREE.MathUtils.lerp(4.35, 3.45, progress);
      cam.fov = THREE.MathUtils.lerp(30, 25, progress);
      cam.updateProjectionMatrix();
      cam.lookAt(0, 0.12, 0);
    }
    gl.localClippingEnabled = true;
  });

  return (
    <>
      <StudioLights accent="#d4b36a" warm="#f3e0b5" />
      <RimGlow color="#d4b36a" />
      <DepthField color="#d4b36a" count={28} radius={3.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial color="#1a1612" metalness={0.45} roughness={0.32} />
      </mesh>
      <Sparkles count={22} scale={[4.2, 2.2, 4.2]} size={1.6} speed={0.32} color="#f0d7a4" />
      <group
        ref={jewel}
        onPointerDown={() => {
          drag.current.down = true;
        }}
        onPointerUp={() => {
          drag.current.down = false;
        }}
        onPointerMove={(e) => {
          if (!interactive || !drag.current.down || !jewel.current) return;
          jewel.current.rotation.y += e.movementX * 0.01;
          jewel.current.rotation.x += e.movementY * 0.008;
        }}
      >
        {interactive ? (
          piece === "necklace" ? (
            <Necklace />
          ) : piece === "earring" ? (
            <Earring />
          ) : (
            <GoldRing />
          )
        ) : (
          <WipeJewellery />
        )}
      </group>
      {interactive ? (
        <OrbitControls enablePan={false} minDistance={2.4} maxDistance={6.2} enableDamping />
      ) : (
        <>
          <group position={[0, 0.1, 0.4]} scale={1.15}>
            <ScanPlane width={1.7} height={2.3} color="#e8d5a3" />
          </group>
          <group ref={phone}>
            <Phone scale={1.28} />
          </group>
        </>
      )}
      <ContactShadows position={[0, -1.18, 0]} opacity={0.4} scale={8} blur={2.4} far={3.6} />
    </>
  );
}
