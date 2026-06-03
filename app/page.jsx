import {
  ArrowRight,
  BadgeIndianRupee,
  Box,
  CheckCircle2,
  MessageCircle,
  QrCode,
  ScanLine,
  Smartphone,
  Store,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const proof = [
  ["QR pages", "Product, catalogue, table, and campaign links"],
  ["AR commerce", "GLB/USDZ model support with mobile AR launch"],
  ["Lead tracking", "WhatsApp, calls, shares, location, and scan events"],
  ["Admin control", "Approvals, plan limits, billing, and reports"]
];

const steps = [
  ["Upload catalogue", "Add products, prices, offers, images, and AR model links."],
  ["Publish scan pages", "Generate QR links for products, menus, tables, and campaigns."],
  ["Customer explores", "Visitors open mobile pages, view product details, and launch AR."],
  ["Business follows up", "WhatsApp leads and analytics show what customers want."]
];

const qrTypes = [
  ["Product QR", QrCode, "A direct product page with AR, price, stock, and WhatsApp order CTA."],
  ["Catalogue QR", Store, "A mobile storefront for restaurants, boutiques, shops, and showrooms."],
  ["Table QR", ScanLine, "Restaurant table ordering with table number included in WhatsApp."],
  ["Campaign QR", WandSparkles, "Offer pages for launches, festivals, exhibitions, and events."]
];

const industries = ["Restaurants", "Sweet shops", "Furniture", "Jewellery", "Boutiques", "Real estate", "Automobile", "Electronics", "Gift shops", "Events"];

const startupBenefits = [
  ["Sell demo first", "Use one sample QR/AR page to convince clients before full onboarding."],
  ["Protect costs", "Plan limits keep products, AR models, storage, and staff usage controlled."],
  ["Show ROI", "Reports convert scan and lead activity into proof clients understand."],
  ["Upsell clearly", "AR products, storage, campaigns, and annual billing become natural add-ons."]
];

const pricing = [
  ["Starter", "Rs. 1,999/mo", "Image catalogue, QR pages, WhatsApp leads"],
  ["Growth", "Rs. 5,999/mo", "5 AR products, table QR, campaigns, reports"],
  ["Premium", "Rs. 12,999/mo", "15 AR products, staff, analytics, branded pages"]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-soft">
            <ScanLine size={22} />
          </span>
          <span>
            <span className="block text-lg font-black">AR Design Studio</span>
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-brand">Scan. View. Experience. Order.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Button href="/pricing" variant="ghost">Pricing</Button>
          <Button href="/business/login" variant="light">Client login</Button>
          <Button href="/contact?source=nav" variant="accent">Get demo</Button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            QR catalogue + AR product viewer + WhatsApp lead engine
          </div>
          <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            Turn any product catalogue into a scan-ready sales experience.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
            AR Design Studio helps local businesses publish QR product pages, show 3D/AR previews, collect WhatsApp enquiries, and prove results with analytics.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact?source=hero-demo" variant="accent">Request Free Demo <ArrowRight size={18} /></Button>
            <Button href="/pricing" variant="light">Compare Plans</Button>
            <Button href="/business/register">Create Business Account</Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {proof.map(([label, text]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-black text-ink">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-4 top-8 hidden h-36 w-36 rounded-full bg-orange-200/50 blur-3xl lg:block" />
          <Card className="relative overflow-hidden p-0 shadow-xl">
            <div className="bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">Live QR preview</p>
                  <p className="mt-1 text-xl font-black">Customer product page</p>
                </div>
                <QrCode />
              </div>
            </div>
            <div className="p-5">
              <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-teal-900 to-orange-500 p-5 text-white">
                <div className="flex min-h-72 flex-col justify-between">
                  <div className="flex justify-between">
                    <Box size={48} />
                    <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-black">AR ready</span>
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-100">Mobile-first catalogue</p>
                    <h2 className="mt-2 text-4xl font-black">Scan, rotate, view, order</h2>
                    <p className="mt-3 text-sm font-semibold text-white/80">Built for shops, showrooms, restaurants, and service businesses.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {["Scans", "AR views", "WhatsApp leads"].map((label) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xl font-black">Live</p>
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">How it works</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">One simple flow from upload to enquiry</h2>
          </div>
          <Smartphone className="hidden text-brand md:block" size={38} />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span>
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 lg:grid-cols-4">
        {qrTypes.map(([title, Icon, text]) => (
          <Card key={title}>
            <Icon className="text-brand" size={32} />
            <h3 className="mt-5 text-xl font-black">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="font-black text-brand">Built for startup growth</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">A platform you can sell, manage, and scale</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">The app is not just a product viewer. It gives owners the controls needed to run subscriptions, protect hosting cost, and prove value to clients.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {startupBenefits.map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <CheckCircle2 className="text-brand" />
                <h3 className="mt-3 font-black">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="font-black text-brand">Industries</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Made for local commerce categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {industries.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Plans</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Start small, then upsell AR and campaigns</h2>
          </div>
          <Button href="/pricing" variant="light">Full Pricing</Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {pricing.map(([name, price, text], index) => (
            <Card key={name} className={index === 1 ? "border-teal-200 ring-4 ring-teal-100" : ""}>
              <div className="flex items-center gap-3">
                <BadgeIndianRupee className="text-accent" />
                <h3 className="text-2xl font-black">{name}</h3>
              </div>
              <p className="mt-3 text-2xl font-black text-brand">{price}</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <Card className="grid gap-6 bg-ink text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-black text-teal-200">Ready for a client demo</p>
            <h2 className="mt-2 text-3xl font-black">Create one scan-ready sample and turn it into a paid account.</h2>
            <p className="mt-3 font-semibold text-slate-300">Public QR pages stay open. Dashboards stay private. Leads stay trackable.</p>
          </div>
          <Button href="/contact?source=footer-demo" variant="light"><MessageCircle size={18} /> Request Demo</Button>
        </Card>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm font-semibold text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AR Design Studio.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/super-admin/login" className="font-black">Super Admin</Link>
          <Link href="/business/login" className="font-black">Client Login</Link>
          <Link href="/install" className="font-black">Install App</Link>
          <Link href="/contact" className="font-black">Demo</Link>
        </div>
      </footer>
    </main>
  );
}
