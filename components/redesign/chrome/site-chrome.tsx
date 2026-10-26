"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CustomCursor } from "@/components/redesign/chrome/custom-cursor";
import { Grain } from "@/components/redesign/chrome/grain";
import { MainNav } from "@/components/redesign/chrome/main-nav";
import { ArNav } from "@/components/redesign/chrome/ar-nav";
import { SiteFooter } from "@/components/redesign/chrome/site-footer";
import { ScrollProgress } from "@/components/redesign/chrome/scroll-progress";
import { ScanOverlay } from "@/components/redesign/chrome/scan-overlay";
import { MobileCta } from "@/components/redesign/chrome/mobile-cta";

export function SiteChrome({
  children,
  arHost = false,
}: {
  children: ReactNode;
  arHost?: boolean;
}) {
  const pathname = usePathname();
  const path = pathname || "/";
  const isDashboard =
    path.startsWith("/business") ||
    path.startsWith("/staff") ||
    path.startsWith("/team") ||
    path.startsWith("/super-admin");
  const isImmersive =
    /^\/ar\/demo\/[^/]+$/.test(path) || path.startsWith("/ar/try-on");
  const isStudio = path === "/ar/create";
  // AR domain homepage + /ar/* use AR chrome. Dashboards never use this shell.
  const isAr = !isDashboard && (arHost || path === "/" || path.startsWith("/ar"));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <ScanOverlay>
        <Grain />
        <ScrollProgress />
        {isStudio ? null : <CustomCursor />}
        {isImmersive ? null : isAr ? <ArNav ready /> : <MainNav ready />}
        <main id="main-content" className="relative flex-1">
          {children}
        </main>
        {isImmersive ? null : <SiteFooter ar={isAr} />}
        {isImmersive || isStudio ? null : <MobileCta ar={isAr} />}
      </ScanOverlay>
    </>
  );
}
