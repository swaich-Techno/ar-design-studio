"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "@/components/redesign/3d/studio-lights";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

function RingStack({
  clipClay,
  clipChrome,
}: {
  clipClay: THREE.Plane;
  clipChrome: THREE.Plane;
}) {
  const rot: [number, number, number] = [Math.PI / 2.18, 0.12, 0];
  return (
    <group>
      <mesh rotation={rot}>
        <torusGeometry args={[0.58, 0.085, 10, 56]} />
        <meshBasicMaterial color="#8e97b0" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh rotation={rot}>
        <torusGeometry args={[0.58, 0.085, 48, 96]} />
        <meshStandardMaterial
          color="#c6bdb0"
          roughness={0.88}
          metalness={0.06}
          clippingPlanes={[clipClay]}
          clipShadows
        />
      </mesh>
      <mesh rotation={rot}>
        <torusGeometry args={[0.58, 0.085, 48, 120]} />
        <meshStandardMaterial
          color="#d7dde8"
          metalness={0.78}
          roughness={0.16}
          emissive="#3d4258"
          emissiveIntensity={0.18}
          clippingPlanes={[clipChrome]}
          clipShadows
        />
      </mesh>
      <mesh rotation={rot}>
        <torusGeometry args={[0.58, 0.02, 12, 80]} />
        <meshStandardMaterial
          color="#b7a8ff"
          metalness={0.55}
          roughness={0.22}
          emissive="#8b7cff"
          emissiveIntensity={0.22}
          clippingPlanes={[clipChrome]}
        />
      </mesh>
      <mesh position={[0, 0.64, 0.04]}>
        <octahedronGeometry args={[0.155, 2]} />
        <meshStandardMaterial
          color="#eef4ff"
          metalness={0.22}
          roughness={0.06}
          emissive="#9ab6ff"
          emissiveIntensity={0.38}
          clippingPlanes={[clipChrome]}
        />
      </mesh>
      <mesh position={[0, 0.64, 0.04]}>
        <octahedronGeometry args={[0.155, 0]} />
        <meshBasicMaterial color="#c5c0b4" wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export function MaterialiseWorld({ hoverRef }: { hoverRef: MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const bloom = useRef<THREE.Mesh>(null);
  const clipClay = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.2), []);
  const clipChrome = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), -0.05), []);
  const reduced = prefersReducedMotion();

  useFrame(({ clock, gl, camera }) => {
    gl.localClippingEnabled = true;
    const hover = hoverRef.current ? 1 : 0;
    const speed = reduced ? 0 : 0.22 + hover * 0.55;
    const t = reduced ? 0.35 : (Math.sin(clock.elapsedTime * speed) + 1) / 2;
    const x = THREE.MathUtils.lerp(-0.82, 0.82, t);
    clipClay.constant = x + 0.16;
    clipChrome.constant = x - 0.06;
    if (scan.current) scan.current.position.x = x;
    if (bloom.current) {
      bloom.current.position.x = x;
      const mat = bloom.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.22 + hover * 0.12;
    }
    if (group.current) {
      group.current.rotation.y = reduced
        ? 0.4
        : clock.elapsedTime * 0.12 + hover * 0.22;
      group.current.rotation.x = 0.18 + hover * 0.12;
    }
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, hover ? 3.35 : 3.7, 0.06);
  });

  return (
    <>
      <StudioLights accent="#8b7cff" warm="#d5dbe6" />
      <group ref={group} position={[0, -0.08, 0]}>
        <RingStack clipClay={clipClay} clipChrome={clipChrome} />
        <mesh ref={scan} rotation={[0, 0, 0.02]}>
          <planeGeometry args={[0.018, 1.55]} />
          <meshBasicMaterial color="#cfc8ff" transparent opacity={0.85} depthWrite={false} />
        </mesh>
        <mesh ref={bloom} rotation={[0, 0, 0.02]}>
          <planeGeometry args={[0.14, 1.55]} />
          <meshBasicMaterial color="#b7a8ff" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}
