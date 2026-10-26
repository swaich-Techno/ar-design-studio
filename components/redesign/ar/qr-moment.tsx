"use client";

import { RealQr } from "@/components/redesign/ar/real-qr";

export function QrMoment() {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-2">
        <div>
          <p className="kicker">Interactive QR</p>
          <h2 className="headline mt-4 text-[clamp(2.4rem,5vw,4.6rem)]">
            Scan. Open.
            <span className="block">View. Enquire.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted">
            A table tent, a menu card, a poster. One scan. The dish is already on their table.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-[#101114] p-8">
          <RealQr path="/ar/demo" />
        </div>
      </div>
    </section>
  );
}
