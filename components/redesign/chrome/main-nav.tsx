"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/redesign/brand/logo";
import { Button } from "@/components/redesign/ui/button";
import { Magnetic } from "@/components/redesign/ui/magnetic";
import { useScanNav } from "@/components/redesign/chrome/scan-overlay";
import { site, waLink } from "@/lib/redesign/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/ar", label: "B Socio AR", scan: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MainNav({ ready: _ready }: { ready: boolean }) {
  const scan = useScanNav();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
        <div className="optical-glass rounded-full px-3 py-2">
          <Logo compact />
        </div>
        <nav className="optical-glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => {
                if (!link.scan) return;
                event.preventDefault();
                scan.go(link.href);
              }}
              className="rounded-full px-3 py-1.5 text-[0.78rem] tracking-wide text-[var(--fg)]/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            className="text-[0.75rem] tracking-wide text-muted hover:text-white"
            href={waLink(site.whatsapp.main, "Hi B Socio — I want to start a project.")}
          >
            WhatsApp
          </a>
          <Magnetic>
            <Button asChild>
              <Link href="/contact">Start a Project</Link>
            </Button>
          </Magnetic>
        </div>
        <button
          className="optical-glass grid h-11 w-11 place-items-center rounded-full md:hidden"
          aria-expanded={open}
          aria-label="Open menu"
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
            className="mx-5 optical-glass rounded-3xl p-5 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link href="/contact">Start a Project</Link>
              </Button>
              <a
                className="text-sm text-muted"
                href={waLink(site.whatsapp.main, "Hi B Socio — I want to start a project.")}
              >
                Talk on WhatsApp
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
