import {
  ArrowRight,
  BadgeIndianRupee,
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
    description: "Create QR catalogues, AR product viewers and interactive digital experiences for local businesses with B Socio.",
    images: ["https://ar.bsocio.in/og-image.jpg"]
  }
};

const steps = [
  "We create your digital catalogue",
  "Products, prices, images, and details are added",
  "QR codes are generated",
  "Customers scan and view the catalogue",
  "Customers send enquiries on WhatsApp",
  "You track leads and update products"
];

const qrTypes = [
  ["Product QR", QrCode, "A direct product page with AR, price, stock, and WhatsApp enquiry CTA."],
  ["Catalogue QR", Store, "A mobile storefront for restaurants, boutiques, sweet shops, showrooms, and local brands."],
  ["Table QR", ScanLine, "Restaurant table QR menu pages with item details and enquiry options."],
  ["Campaign QR", WandSparkles, "Offer pages for festivals, exhibitions, launches, events, and seasonal campaigns."]
];

const pricing = [
  ["Starter", "Rs. 1,999/month", "QR catalogue, product pages, WhatsApp leads, and mobile-first browsing."],
  ["Growth", "Rs. 5,999/month", "AR products, table QR, campaign QR pages, analytics, and reports."],
  ["Premium", "Rs. 12,999/month", "Larger catalogues, staff workflows, advanced analytics, and branded pages."]
];

const schema = [organizationSchema(), localBusinessSchema(), softwareApplicationSchema(), websiteSchema(), faqSchema()];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header>
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5" aria-label="Primary navigation">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-soft">
              <ScanLine size={22} aria-hidden="true" focusable="false" />
            </span>
            <span>
              <span className="block text-lg font-black">AR Design Studio</span>
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-brand">by B Socio</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Button href="/pricing" variant="ghost">Pricing</Button>
            <Button href="/team/login" variant="ghost">Team Login</Button>
            <Button href="/contact" variant="light" data-track-event="demo_request_click" data-track-source="nav">View Demo</Button>
            <WhatsAppButton source="home-nav">Talk on WhatsApp</WhatsAppButton>
          </div>
        </nav>
      </header>

      <main id="main-content">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            QR catalogue + AR product viewer + WhatsApp enquiry system
          </div>
          <h1 className="max-w-5xl text-4xl font-black leading-[1.04] md:text-6xl">
            QR Catalogue & AR Product Viewer for Local Businesses
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
            Create digital product catalogues, AR previews, QR menus, and WhatsApp enquiry pages for shops, restaurants, sweet shops, furniture stores, jewellery businesses, and local brands.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="accent" data-track-event="demo_request_click" data-track-source="hero-demo">View Demo <ArrowRight size={18} aria-hidden="true" focusable="false" /></Button>
            <WhatsAppButton source="home-hero">Talk on WhatsApp</WhatsAppButton>
            <Button href="/pricing" variant="light">See Pricing</Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["QR catalogue for shops", "AR product viewer India", "QR product catalogue with WhatsApp order", "Digital product catalogue for local business"].map((label) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 font-black text-ink"><BadgeCheck className="text-brand" size={18} /> {label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <img
            src="/og-image.jpg"
            alt="QR catalogue and AR product viewer for local businesses"
            width="1200"
            height="675"
            fetchPriority="high"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {["Scan QR", "View Products", "Enquire on WhatsApp"].map((label) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xl font-black">Live</p>
                <p className="text-xs font-bold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="font-black text-brand">What is AR Design Studio?</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Interactive QR pages for products, menus, catalogues, and campaigns.</h2>
          </div>
          <Card>
            <p className="text-base font-semibold leading-8 text-slate-600">
              AR Design Studio helps local businesses turn products, menus, catalogues, and campaigns into interactive QR pages. Customers can scan a QR code, view products, see AR/3D previews where available, and send enquiries directly on WhatsApp.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Who is it for?</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Built for local businesses in India</h2>
          </div>
          <Smartphone className="hidden text-brand md:block" size={38} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {["Sweet Shops", "Restaurants", "Furniture Stores", "Jewellery Stores", "Boutiques", "Real Estate", "Automobile", "Electronics", "Gift Shops", "Events"].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Store className="text-brand" />
              <h3 className="mt-4 font-black">{item}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">QR catalogue, mobile product pages, and WhatsApp enquiry flow.</p>
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
        <div className="mb-6">
          <p className="font-black text-brand">Main features</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Everything needed for a scan-to-enquiry catalogue</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {mainFeatures.map((feature) => (
            <div key={feature} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-slate-700 shadow-sm">
              <CheckCircle2 className="mb-3 text-brand" size={19} /> {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7">
          <p className="font-black text-brand">How it works</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">From digital catalogue to WhatsApp lead</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span>
              <h3 className="mt-4 text-lg font-black">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Explore QR & AR Solutions by Industry</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Landing pages for your main customer categories</h2>
          </div>
          <Button href="/contact" variant="light" data-track-event="industry_page_cta_click" data-track-source="industry-section">Get QR Catalogue Demo</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industryPages.map((industry) => (
            <Link key={industry.slug} href={`/${industry.slug}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:text-brand">
              <Box className="text-brand" />
              <h3 className="mt-4 text-xl font-black">{industry.label}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{industry.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">Open page <ExternalLink size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Pricing</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Simple plans for QR catalogue growth</h2>
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
        <div className="mt-6 rounded-[28px] border border-orange-200 bg-orange-50 p-5">
          <p className="font-black text-orange-900">Need custom QR/AR setup? Talk to us on WhatsApp.</p>
          <WhatsAppButton className="mt-4" source="home-pricing">Talk on WhatsApp</WhatsAppButton>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6">
          <p className="font-black text-brand">FAQ</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Questions local business owners ask</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map(([question, answer]) => (
            <div key={question} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black">{question}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <Card className="grid gap-6 bg-ink text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-black text-teal-200">{BRAND.name} by {BRAND.parent}</p>
            <h2 className="mt-2 text-3xl font-black">Create your digital catalogue and start collecting WhatsApp enquiries.</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-300">
              Email: {BRAND.email} | WhatsApp: {BRAND.phone} | Location: {BRAND.location}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <WhatsAppButton variant="light" source="home-footer">Talk on WhatsApp</WhatsAppButton>
            <Button href="/contact" variant="accent" data-track-event="demo_request_click" data-track-source="footer-demo"><MessageCircle size={18} aria-hidden="true" focusable="false" /> Get QR Catalogue Demo</Button>
          </div>
        </Card>
      </section>
      </main>

      <footer className="mx-auto grid max-w-7xl gap-4 px-5 py-10 text-sm font-semibold text-slate-600 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-black text-ink">B Socio / AR Design Studio by B Socio</p>
          <p className="mt-1">Email: {BRAND.email} | Phone/WhatsApp: {BRAND.phone} | Service area: {BRAND.location}</p>
          <p className="mt-1">Copyright 2026 AR Design Studio by B Socio.</p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          <Link href="/pricing" className="font-black">Pricing</Link>
          <Link href="/contact" className="font-black">Contact</Link>
          <Link href="/super-admin/login" className="font-black">Super Admin</Link>
          <Link href="/team/login" className="font-black">Team Login</Link>
          <Link href="/business/login" className="font-black">Client Login</Link>
        </nav>
      </footer>
    </div>
  );
}
