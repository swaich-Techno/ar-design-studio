"use client";

import { motion } from "motion/react";

const funnel = [
  { label: "SCAN", event: "QR / table open" },
  { label: "VIEW", event: "Dish page" },
  { label: "3D", event: "Viewer open" },
  { label: "AR", event: "Place on table" },
  { label: "WHATSAPP", event: "Enquiry" },
];

export function DemoAnalytics() {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Analytics</p>
        <h2 className="headline mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,4.2rem)]">
          What a scan can record.
        </h2>
        <p className="mt-3 inline-flex rounded-full border border-[var(--gold)]/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--gold)]">
          DEMO DATA · event types, not invented counts
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
          {funnel.map((step, i) => (
            <motion.span
              key={step.label}
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <span className="rounded-full border border-white/15 px-3 py-2 text-[var(--fg)]/85">
                {step.label}
                <span className="mt-1 block text-[0.6rem] font-normal normal-case tracking-normal text-muted">{step.event}</span>
              </span>
              {i < funnel.length - 1 ? <span aria-hidden>→</span> : null}
            </motion.span>
          ))}
        </div>
        <p className="mt-6 max-w-xl text-sm text-muted">
          Live client dashboards show real events for that business. This marketing page does not display sample sales
          figures.
        </p>
      </div>
    </section>
  );
}
