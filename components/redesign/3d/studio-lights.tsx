"use client";

export function StudioLights({
  accent = "#8b7cff",
  warm = "#f0d7a4",
}: {
  accent?: string;
  warm?: string;
}) {
  return (
    <>
      <hemisphereLight args={["#f4f1ff", "#14110e", 0.95]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4.5, 7.2, 5.5]} intensity={2.8} color="#fff4e6" />
      <directionalLight position={[-5.5, 2.4, 1.2]} intensity={1.55} color={accent} />
      <directionalLight position={[1.2, -2.8, 3]} intensity={0.55} color={warm} />
      <pointLight position={[0, 1.6, 3.4]} intensity={10} color={warm} distance={18} />
      <pointLight position={[2.6, -0.8, 2.2]} intensity={5.2} color={accent} distance={14} />
      <spotLight
        position={[0, 5.4, 2.2]}
        angle={0.55}
        penumbra={0.7}
        intensity={18}
        color="#fff8ee"
        distance={16}
      />
    </>
  );
}
