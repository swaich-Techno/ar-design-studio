"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { site, waLink } from "@/lib/redesign/site";
import { CtaOrbit } from "@/components/redesign/main/cta-orbit";
import { ctaPulse } from "@/lib/redesign/cta-pulse";
import { prefersReducedMotion } from "@/lib/redesign/runtime";

export function FinalCta() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const onScroll = () => {
      if (reduced) {
        ctaPulse.scroll = 1;
        el.classList.add("is-in");
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.88 - rect.top) / (vh * 0.55)));
      ctaPulse.scroll = p;
      el.classList.toggle("is-in", p > 0.18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={section} className="cta-final relative overflow-hidden px-5 py-32 md:px-10">
      <div className="cta-final__core" aria-hidden>
        <CtaOrbit />
      </div>
      <div className="relative z-[4] mx-auto max-w-[1400px]">
        <h2 className="headline max-w-[10ch] text-[clamp(3rem,8vw,7rem)] md:max-w-[11ch] md:w-[55%]">
          Have something
          <span className="block">worth experiencing?</span>
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic strength={10}>
            <Link
              href="/contact"
              className="cta-primary"
              onPointerEnter={() => {
                ctaPulse.hover = 1;
              }}
              onPointerLeave={() => {
                ctaPulse.hover = 0;
              }}
            >
              Start a Project
              <span className="cta-primary__arrow" aria-hidden>
                ↗
              </span>
            </Link>
          </Magnetic>
          <Magnetic>
            <a
              href={waLink(site.whatsapp.main, "Hi B Socio — I want to talk about a project.")}
              className="cta-wa"
            >
              <span className="cta-wa__dot" aria-hidden />
              Talk on WhatsApp
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
