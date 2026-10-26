"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChromeMaterial, GemMaterial, GoldMaterial, GlassMaterial } from "@/components/redesign/3d/materials";
import { pointer } from "@/lib/redesign/pointer";

export function Phone({
  scale = 1,
  screenColor = "#0b0c12",
}: {
  scale?: number;
  screenColor?: string;
}) {
  return (
    <group scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.86, 1.78, 0.08]} />
        <ChromeMaterial color="#9aa3b2" roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[0.76, 1.64]} />
        <meshStandardMaterial color={screenColor} roughness={0.18} metalness={0.2} emissive={screenColor} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.78, 0.05]}>
        <capsuleGeometry args={[0.03, 0.16, 8, 12]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.46, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.04]} />
        <ChromeMaterial roughness={0.3} />
      </mesh>
    </group>
  );
}

export function BrowserPanel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.35, 0.9, 0.04]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[0, 0.34, 0.025]}>
        <planeGeometry args={[1.22, 0.12]} />
        <meshBasicMaterial color="#1b1c24" />
      </mesh>
      <mesh position={[-0.46, 0.34, 0.03]}>
        <circleGeometry args={[0.025, 12]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, -0.05, 0.026]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshBasicMaterial color="#8b7cff" opacity={0.35} transparent />
      </mesh>
    </group>
  );
}

export function Aperture() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.35;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]} position={[0.18, 0, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.02]} />
          <ChromeMaterial roughness={0.2} />
        </mesh>
      ))}
      <mesh>
        <torusGeometry args={[0.36, 0.03, 12, 48]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

export function QrTile() {
  const cells = [
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
    0, 1, 0, 1, 0, 1, 0,
    1, 0, 1, 0, 1, 0, 1,
    1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 1, 0, 1,
  ];
  return (
    <group>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[0.78, 0.78, 0.04]} />
        <meshStandardMaterial color="#0d0e12" />
      </mesh>
      {cells.map((on, i) => {
        if (!on) return null;
        const x = (i % 7) * 0.09 - 0.27;
        const y = 0.27 - Math.floor(i / 7) * 0.09;
        return (
          <mesh key={i} position={[x, y, 0.01]}>
            <boxGeometry args={[0.07, 0.07, 0.03]} />
            <meshStandardMaterial color="#e8e2d4" emissive="#8b7cff" emissiveIntensity={0.18} />
          </mesh>
        );
      })}
    </group>
  );
}

export function PlayTile() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.7, 0.86, 0.05]} />
        <meshStandardMaterial color="#14151c" roughness={0.3} metalness={0.4} emissive="#8b7cff" emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.04, 0, 0.04]}>
        <coneGeometry args={[0.14, 0.22, 3]} />
        <meshBasicMaterial color="#f3efe6" />
      </mesh>
    </group>
  );
}

export function MessageBubble() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#25d366" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[-0.16, -0.22, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.1, 0.16, 8]} />
        <meshStandardMaterial color="#25d366" roughness={0.35} />
      </mesh>
    </group>
  );
}

export function ScanPlane({ color = "#8b7cff", width = 2.4, height = 3.2 }: { color?: string; width?: number; height?: number }) {
  const bar = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (bar.current) {
      bar.current.position.y = ((clock.elapsedTime * 0.22) % 1) * height - height / 2;
    }
  });
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.32} />
      </mesh>
      <mesh ref={bar}>
        <planeGeometry args={[width, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function GoldRing({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.nx * 0.5, 0.06);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.35 + pointer.ny * 0.25, 0.06);
  });
  return (
    <group ref={ref} scale={scale}>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.55, 0.09, 32, 96]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <GemMaterial />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 0.08, 8]} />
        <GoldMaterial roughness={0.12} />
      </mesh>
    </group>
  );
}

export function Necklace() {
  const beads = 14;
  return (
    <group>
      {Array.from({ length: beads }).map((_, i) => {
        const t = i / (beads - 1);
        const a = Math.PI * (0.15 + t * 0.7);
        return (
          <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.46 - 0.1, Math.sin(t * Math.PI) * 0.08]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <GoldMaterial />
          </mesh>
        );
      })}
      <mesh position={[0, -0.28, 0.08]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <GoldMaterial roughness={0.12} />
      </mesh>
      <mesh position={[0, -0.28, 0.18]}>
        <octahedronGeometry args={[0.07, 0]} />
        <GemMaterial />
      </mesh>
    </group>
  );
}

export function Earring() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <GemMaterial color="#f4fbff" />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.18, 8]} />
        <GoldMaterial />
      </mesh>
    </group>
  );
}

export function DessertPlate() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.06, 48]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.28} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.22, 32]} />
        <meshStandardMaterial color="#3b2118" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.3, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#24140f" roughness={0.32} />
      </mesh>
      <mesh position={[0.08, 0.22, 0.12]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#8b1e2d" roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, 0.18, 0.1]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#6b1020" roughness={0.4} />
      </mesh>
      <mesh position={[0.22, 0.08, 0.16]} rotation={[0.4, 0.2, 0.6]}>
        <boxGeometry args={[0.12, 0.02, 0.05]} />
        <meshStandardMaterial color="#2f6b45" roughness={0.6} />
      </mesh>
      <mesh position={[0.28, -0.16, 0.18]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <GoldMaterial roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Burger() {
  return (
    <group>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.55, 0.58, 0.06, 32]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.42, 0.44, 0.12, 28]} />
        <meshStandardMaterial color="#d9a066" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.14, 24]} />
        <meshStandardMaterial color="#5a2a16" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.04, 24]} />
        <meshStandardMaterial color="#6aa35a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e2a45a" roughness={0.5} />
      </mesh>
      {[0.12, -0.1, 0.02].map((x, i) => (
        <mesh key={i} position={[x, 0.38, i === 1 ? 0.12 : -0.05]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f4e1b5" />
        </mesh>
      ))}
    </group>
  );
}

export function Mocktail() {
  return (
    <group>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.08, 20]} />
        <ChromeMaterial roughness={0.25} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
        <GlassMaterial color="#e8f6ff" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.2, 0.12, 0.42, 24]} />
        <meshStandardMaterial color="#7a1630" roughness={0.25} emissive="#5a1020" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.12, 0.52, 0.08]} rotation={[0.4, 0, 0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.04]} />
        <meshStandardMaterial color="#2f6b45" />
      </mesh>
    </group>
  );
}

export function CentralOrbitCore() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.22;
      ref.current.rotation.z += d * 0.05;
    }
  });
  return (
    <group ref={ref} scale={1.18}>
      <mesh>
        <torusGeometry args={[0.92, 0.18, 48, 96]} />
        <ChromeMaterial />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.55, 0.2]}>
        <torusGeometry args={[0.64, 0.08, 24, 80]} />
        <ChromeMaterial color="#b7c0cf" />
      </mesh>
      <mesh rotation={[0.8, 0.2, 0.4]}>
        <torusGeometry args={[1.08, 0.018, 12, 96]} />
        <meshBasicMaterial color="#8b7cff" transparent opacity={0.55} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <GlassMaterial />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color="#8b7cff" />
      </mesh>
    </group>
  );
}
