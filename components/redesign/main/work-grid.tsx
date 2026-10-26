"use client";

import Link from "next/link";
import { conceptWork } from "@/lib/redesign/site";
import { ExperienceVisual } from "@/components/redesign/main/experience-scenes";

export function WorkGrid() {
  return (
    <section className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker">Selected experiences</p>
            <h2 className="headline mt-4 text-[clamp(2.2rem,5vw,4.4rem)]">Food. The engine.</h2>
          </div>
          <Link href="/ar/demo" className="hidden text-sm text-muted md:block">
            Open demo
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {conceptWork.map((item, index) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#101114]"
            >
              <ExperienceVisual slug={item.slug} index={index} />
              <div className="relative z-[3] flex h-full min-h-[340px] flex-col justify-between p-6">
                <span className="w-fit rounded-full border border-white/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em]">
                  {item.label}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.vertical}</p>
                  <h3 className="exp-title mt-2 font-display text-3xl tracking-tight">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
