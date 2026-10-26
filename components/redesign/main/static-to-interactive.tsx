"use client";

import { useState } from "react";

const LEFT = ["Printed card", "Static photos", "No table context", "Call the waiter"];
const RIGHT = ["QR on the table", "Hero dish in 3D", "Place on table where supported", "WhatsApp enquiry"];

export function StaticToInteractive() {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">The shift</p>
        <h2 className="headline mt-4 max-w-[18ch] text-[clamp(2.2rem,5vw,4.4rem)]">
          FROM STATIC MENU TO INTERACTIVE EXPERIENCE
        </h2>
        <button
          type="button"
          className="relative mt-10 grid min-h-[280px] overflow-hidden rounded-[32px] border border-white/10 md:grid-cols-2"
          onClick={() => setOpen((value) => !value)}
          aria-pressed={open}
        >
          <div className="bg-[#101114] p-8 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Traditional</p>
            <ul className="mt-6 space-y-3 text-[var(--fg)]/80">
              {LEFT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#16090c] p-8 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--amber)]">B Socio interactive</p>
            <ul className="mt-6 space-y-3 text-[var(--cream)]">
              {RIGHT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <span
            className={`pointer-events-none absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(243,230,208,0.16),transparent)] transition-transform duration-700 ${open ? "translate-x-full" : "translate-x-0"}`}
            aria-hidden
          />
        </button>
        <p className="mt-4 text-sm text-muted">Tap the comparison to wipe between a printed list and an interactive menu.</p>
      </div>
    </section>
  );
}
