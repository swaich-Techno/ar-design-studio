import {
  ArrowRight,
  BadgeCheck,
  Box,
  CheckCircle2,
  ExternalLink,
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
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BRAND, faqItems, faqSchema, industryPages, localBusinessSchema, mainFeatures, organizationSchema, softwareApplicationSchema, websiteSchema } from "@/lib/marketing";

export const metadata = {
  title: "AR Design Studio by B Socio | QR & AR Catalogue",
  description: "Create QR catalogues, AR product viewers and interactive digital experiences for local businesses with B Socio.",
  alternates: {
    canonical: "https://ar.bsocio.in/"
  },
  openGraph: {
    title: "AR Design Studio by B Socio | QR & AR Catalogue",
    description: "Create QR catalogues, AR product viewers and interactive digital experiences for local businesses with B Socio.",
    images: ["https://ar.bsocio.in/og-image.jpg"],
    url: "https://ar.bsocio.in/",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Design Studio by B Socio | QR & AR Catalogue",
    description: "Create QR catalogues, AR product viewers and interactive digital experiences with B Socio.",
    images: ["https://ar.bsocio.in/og-image.jpg"]
  }
};

const schema = [organizationSchema(), localBusinessSchema(), softwareApplicationSchema(), websiteSchema(), faqSchema()];

const qrTypes = [
  ["Product QR", QrCode, "Product page, price, stock, AR preview, WhatsApp CTA."],
  ["Catalogue QR", Store, "Mobile storefront for local shops and service brands."],
  ["Table QR", ScanLine, "Restaurant table menu pages with instant enquiry flow."],
  ["Campaign QR", WandSparkles, "Offer pages for launches, festivals, and exhibitions."]
];

const outcomes = [
  ["Scan-ready", "QR pages for products, menus, offers, and catalogues."],
  ["AR-ready", "GLB for web and Android. USDZ for iPhone/iPad."],
  ["Lead-ready", "Every page can move customers to WhatsApp fast."]
];

const steps = [
  ["Build", "Products, prices, photos, and 3D files are added."],
  ["Publish", "QR pages go live for counters, packaging, ads, and socials."],
  ["Track", "Leads, scans, products, staff, and campaigns stay manageable."]
];

const pricing = [
  ["Starter", "Rs. 1,999/month", "Image catalogue, product pages, WhatsApp leads."],
  ["Growth", "Rs. 5,999/month", "AR products, table QR, campaigns, analytics."],
  ["Premium", "Rs. 12,999/month", "Larger catalogues, staff workflows, reports."]
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3" aria-label="Primary navigation">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="AR Design Studio home">
            <img
              src="/brand/ar-studio-logo.jpg"
              alt=""
              width="44"
              height="44"
              className="h-11 w-11 rounded-lg object-cover shadow-sm"
            />
            <span className="leading-tight">
              <span className="block text-base font-black">AR Design Studio</span>
              <span className="block text-xs font-black uppercase text-brand">by B Socio</span>
            </span>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Button href="/pricing" variant="ghost">Pricing</Button>
            <Button href="/contact" variant="light" data-track-event="demo_request_click" data-track-source="nav">View Demo</Button>
            <WhatsAppButton source="home-nav">WhatsApp</WhatsAppButton>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-black text-brand">
              <BadgeCheck size={16} aria-hidden="true" focusable="false" />
              QR + AR + WhatsApp catalogue
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.04] md:text-6xl">
              Scan. View. Enquire.
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-slate-600">
              A fast digital catalogue system for local businesses that need QR pages, AR previews, and direct WhatsApp leads.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="accent" data-track-event="demo_request_click" data-track-source="hero-demo">
                View Demo <ArrowRight size={18} aria-hidden="true" focusable="false" />
              </Button>
              <WhatsAppButton source="home-hero">Talk on WhatsApp</WhatsAppButton>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {outcomes.map(([title, text]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-black text-ink">{title}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <img
              src="/og-image.jpg"
              alt="QR catalogue and AR product viewer for local businesses"
              width="1200"
              height="675"
              fetchPriority="high"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {["QR catalogue", "3D/AR viewer", "WhatsApp leads"].map((label) => (
                <div key={label} className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-lg font-black">Live</p>
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3">
            {steps.map(([title, text], index) => (
              <div key={title} className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-sm font-black text-white">{index + 1}</span>
                <div>
                  <h2 className="font-black">{title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-black text-brand">Core formats</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">One system. Many scan points.</h2>
            </div>
            <Smartphone className="hidden text-brand md:block" size={36} aria-hidden="true" focusable="false" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {qrTypes.map(([title, Icon, text]) => (
              <Card key={title}>
                <Icon className="text-brand" size={28} aria-hidden="true" focusable="false" />
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-6">
            <p className="font-black text-brand">Use cases</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Made for local business categories</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {industryPages.map((industry) => (
              <Link
                key={industry.slug}
                href={`/${industry.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-soft"
              >
                <Box className="text-brand" aria-hidden="true" focusable="false" />
                <h3 className="mt-4 text-lg font-black">{industry.label}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{industry.intro}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">
                  Open page <ExternalLink size={14} aria-hidden="true" focusable="false" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="bg-ink text-white">
              <p className="font-black text-teal-200">AR model workflow</p>
              <h2 className="mt-3 text-3xl font-black">Upload GLB for web. Add USDZ for iPhone.</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                The product dashboard supports direct model upload progress, hosted model URLs, and AR-ready product checks.
              </p>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2">
              {mainFeatures.slice(0, 6).map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-black text-slate-700 shadow-sm">
                  <CheckCircle2 className="shrink-0 text-brand" size={19} aria-hidden="true" focusable="false" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-black text-brand">Pricing</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Simple monthly plans</h2>
            </div>
            <Button href="/pricing" variant="light">Full Pricing</Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map(([name, price, text], index) => (
              <Card key={name} className={index === 1 ? "border-teal-300 ring-2 ring-teal-100" : ""}>
                <h3 className="text-2xl font-black">{name}</h3>
                <p className="mt-3 text-2xl font-black text-brand">{price}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.slice(0, 4).map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-black">{question}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <Card className="grid gap-6 bg-ink text-white lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-black text-teal-200">{BRAND.fullName}</p>
              <h2 className="mt-2 text-3xl font-black">Launch a scan-to-enquiry catalogue.</h2>
              <p className="mt-3 font-semibold leading-7 text-slate-300">
                {BRAND.email} | {BRAND.phone} | {BRAND.location}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <WhatsAppButton variant="light" source="home-footer">Talk on WhatsApp</WhatsAppButton>
              <Button href="/contact" variant="accent" data-track-event="demo_request_click" data-track-source="footer-demo">
                <MessageCircle size={18} aria-hidden="true" focusable="false" /> View Demo
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <footer className="mx-auto grid max-w-7xl gap-4 px-5 py-10 text-sm font-semibold text-slate-600 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.png" alt="" width="36" height="36" className="h-9 w-9 rounded-lg object-cover" />
          <div>
            <p className="font-black text-ink">B Socio / AR Design Studio</p>
            <p className="mt-1">Copyright 2026 AR Design Studio by B Socio.</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          <Link href="/pricing" className="font-black">Pricing</Link>
          <Link href="/contact" className="font-black">Contact</Link>
          <Link href="/privacy-policy" className="font-black">Privacy Policy</Link>
          <Link href="/team/login" className="font-black">Team Login</Link>
          <Link href="/business/login" className="font-black">Client Login</Link>
        </nav>
      </footer>
    </div>
  );
}
