"use client";

import { motion } from "motion/react";
import { capabilities } from "@/lib/redesign/site";
import { CreativeScene } from "@/components/redesign/main/capability-scenes";

export function CapabilitiesSection() {
  return (
    <section className="relative px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Also from the studio</p>
        <h2 className="headline mt-5 max-w-[12ch] text-[clamp(2.6rem,7vw,6.4rem)]">
          Ideas that move
          <span className="mt-2 block font-serif italic tracking-normal text-[var(--fg)]/80">
            beyond the screen.
          </span>
        </h2>
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {capabilities.map((cap, i) => (
            <motion.article
              key={cap.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101114]/80 ${
                i === 0 ? "lg:col-span-7 min-h-[420px]" : i === 1 ? "lg:col-span-5 min-h-[420px]" : "lg:col-span-6 min-h-[380px]"
              }`}
            >
              <CreativeScene kind={cap.id} />
              <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                <p className="font-display text-3xl tracking-tight">{cap.title}</p>
                <p className="mt-2 max-w-sm text-sm text-muted">{cap.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
