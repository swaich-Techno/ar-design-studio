"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { processSteps } from "@/lib/redesign/site";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

export function Process() {
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!line.current) return;
      gsap.fromTo(
        line.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line.current.parentElement,
            start: "top 75%",
            end: "bottom 40%",
            scrub: reduced ? false : true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">From dish to live menu</p>
        <h2 className="headline mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,4.4rem)]">
          SEND → BUILD → DIGITISE → PLACE → GO LIVE → MEASURE
        </h2>
        <div className="relative mt-10">
          <div className="h-px bg-white/10" />
          <div ref={line} className="absolute left-0 top-0 h-px w-full origin-left bg-[var(--accent-2)]" />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] border border-white/10 bg-[#101114]/80 p-6"
            >
              <p className="font-serif text-5xl italic text-white/25">{step.n}</p>
              <p className="mt-3 font-display text-2xl tracking-[0.08em]">{step.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
