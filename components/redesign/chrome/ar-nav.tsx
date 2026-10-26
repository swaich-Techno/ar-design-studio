"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArLogo } from "@/components/redesign/brand/logo";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { NavPreview } from "@/components/redesign/ar/nav-preview";
import { site, waLink } from "@/lib/redesign/site";

const links = [
  { href: "/ar/food", label: "Food", preview: "food" as const },
  { href: "/ar/demo", label: "Demo" },
  { href: "/ar/pricing", label: "Pricing" },
  { href: "/ar/how-it-works", label: "How it works" },
  { href: "/ar/food-businesses", label: "Food businesses" },
  { href: "/contact", label: "Contact" },
];

export function ArNav({ ready: _ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<"food" | null>(null);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
        <div className="optical-glass rounded-full px-3 py-2">
          <ArLogo />
        </div>
        <nav className="optical-glass relative hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex" aria-label="AR primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[0.78rem] tracking-wide text-[var(--fg)]/80 transition-colors hover:text-white"
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
          className="optical-glass grid h-11 w-11 place-items-center rounded-full lg:hidden"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-5 optical-glass rounded-3xl p-5 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="min-h-11 font-display text-2xl">
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
    </motion.header>
  );
}
