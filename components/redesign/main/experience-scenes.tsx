"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { bindLocalPointer } from "@/lib/redesign/pointer";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

const JEWEL = "/redesign/campaigns/jewellery-ar.webp";
const FOOD = "/redesign/campaigns/food-ar.webp";

function Rig({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindLocalPointer(el, prefersReducedMotion());
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function JewelleryExperience() {
  return (
    <Rig className="exp-scene exp-scene--jewel">
      <div className="exp-scene__bg" />
      <div className="exp-scene__frame" />
      <div className="exp-scene__product">
        <img src={JEWEL} alt="" />
      </div>
      <div className="exp-scene__scan" />
      <span className="exp-scene__node n1" />
      <span className="exp-scene__node n2" />
      <span className="exp-scene__node n3" />
      <span className="exp-scene__node n4" />
      <p className="exp-scene__cta">Explore concept →</p>
    </Rig>
  );
}

function DessertExperience() {
  return (
    <Rig className="exp-scene exp-scene--food">
      <div className="exp-scene__bg" />
      <div className="exp-scene__grid" />
      <div className="exp-scene__product">
        <img src={FOOD} alt="" />
      </div>
      <div className="exp-scene__steam" />
      <div className="exp-scene__ring" />
      <div className="exp-scene__phone" />
      <span className="exp-scene__garnish g1" />
      <span className="exp-scene__garnish g2" />
      <p className="exp-scene__cta">View on your table →</p>
    </Rig>
  );
}

function EngineExperience() {
  return (
    <Rig className="exp-scene exp-scene--engine">
      <div className="exp-scene__bg" />
      <ol className="engine-flow">
        <li>QR</li>
        <li>Product</li>
        <li>3D</li>
        <li>AR</li>
        <li>WhatsApp</li>
        <li>Analytics</li>
      </ol>
      <p className="exp-scene__cta">Scan → Experience → Enquire</p>
    </Rig>
  );
}

export function ExperienceVisual({
  slug,
  index,
}: {
  slug: string;
  index: number;
}) {
  const scene =
    slug === "jewellery-try-on" ? (
      <JewelleryExperience />
    ) : slug === "dessert-menu" ? (
      <DessertExperience />
    ) : (
      <EngineExperience />
    );

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ delay: index * 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {scene}
    </motion.div>
  );
}
