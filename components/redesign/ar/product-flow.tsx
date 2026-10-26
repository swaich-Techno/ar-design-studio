"use client";

import { motion } from "motion/react";

const stages = ["SCAN", "EXPLORE", "VIEW IN 3D", "PLACE IN AR", "ORDER / ENQUIRE"];

export function ProductFlow({ items = stages }: { items?: string[] }) {
  return (
    <div className={`grid gap-3 ${items.length > 5 ? "md:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-5"}`}>
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="rounded-[24px] border border-white/10 bg-[#101114]/80 p-5"
        >
          <p className="font-serif text-4xl italic text-white/20">0{i + 1}</p>
          <p className="mt-2 font-display text-xl">{item}</p>
        </motion.div>
      ))}
    </div>
  );
}
