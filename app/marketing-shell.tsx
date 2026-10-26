import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import { SiteChrome } from "@/components/redesign/chrome/site-chrome";
import { isArHost } from "@/lib/redesign/runtime";
import "./marketing.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export async function MarketingShell({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "";
  return (
    <div
      className={`marketing-shell min-h-screen antialiased ${geistSans.variable} ${geistMono.variable} ${syne.variable} ${instrument.variable}`}
    >
      <SiteChrome arHost={isArHost(host)}>{children}</SiteChrome>
    </div>
  );
}
