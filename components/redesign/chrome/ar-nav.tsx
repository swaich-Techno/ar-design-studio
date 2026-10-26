"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArLogo } from "@/components/redesign/brand/logo";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { NavPreview } from "@/components/redesign/ar/nav-preview";
import { site, waLink } from "@/lib/redesign/site";

const links = [
  { href: "/ar/food", label: "Food", preview: "food" as const },
  { href: "/ar/demo", label: "Demo" },
  { href: "/ar/create", label: "Photo studio" },
  { href: "/ar/pricing", label: "Pricing" },
  { href: "/ar/how-it-works", label: "How it works" },
  { href: "/ar/food-businesses", label: "Food businesses" },
  { href: "/contact", label: "Contact" },
];

export function ArNav({ ready: _ready }: { ready: boolean }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const [hover, setHover] = useState<"food" | null>(null);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
        <div className="optical-glass rounded-full px-3 py-2">
          <ArLogo />
        </div>
        <nav className="optical-glass relative hidden items-center gap-1 rounded-full px-2 py-1.5 xl:flex" aria-label="AR primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="ar-nav-link inline-flex min-h-11 items-center rounded-full px-3 text-[0.78rem] text-[var(--fg)]/80 transition-colors hover:text-white"
              onMouseEnter={() => setHover(link.preview ?? null)}
              onMouseLeave={() => setHover(null)}
            >
              {link.label}
            </Link>
          ))}
          <NavPreview kind={hover} />
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a
            className="text-[0.75rem] tracking-wide text-muted hover:text-white"
            href="https://bsocio.in"
            rel="noreferrer"
          >
            B Socio ↗
          </a>
          <a
            className="text-[0.75rem] tracking-wide text-muted hover:text-white"
            href={waLink(site.whatsapp.ar, "Hi — I want a B Socio AR demo.")}
          >
            Talk on WhatsApp
          </a>
          <Magnetic>
            <Button asChild variant="gold">
              <Link href="/ar/demo#request">Request Demo</Link>
            </Button>
          </Magnetic>
        </div>
        <button
          ref={toggleRef}
          aria-controls="ar-mobile-menu"
          className="optical-glass grid h-11 w-11 place-items-center rounded-full xl:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span className="block h-px bg-white" />
            <span className="block h-px bg-white" />
          </span>
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="ar-mobile-menu"
            role="navigation"
            aria-label="Mobile AR navigation"
            initial={{ opacity: 0, transform: reducedMotion ? "none" : "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            exit={{ opacity: 0, transform: reducedMotion ? "none" : "translateY(-8px)" }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="mx-5 max-h-[75svh] overflow-y-auto overscroll-contain optical-glass rounded-3xl p-5 xl:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)} className="min-h-11 font-display text-2xl">
                  {link.label}
                </Link>
              ))}
              <a href="https://bsocio.in" className="text-sm text-muted" rel="noreferrer">
                B Socio ↗
              </a>
              <Button asChild variant="gold" className="mt-2">
                <Link href="/ar/demo#request" onClick={() => setOpen(false)}>
                  Request Demo
                </Link>
              </Button>
              <a
                className="min-h-11 text-sm text-muted"
                href={waLink(site.whatsapp.ar, "Hi — I want a B Socio AR demo.")}
              >
                Talk on WhatsApp {site.phoneDisplay}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
