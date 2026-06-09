import {
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  BarChart3,
  Box,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  Layers3,
  MessageCircle,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BRAND, faqItems, faqSchema, industryPages, mainFeatures, softwareApplicationSchema } from "@/lib/marketing";

export const metadata = {
  title: "B Socio AR Design Studio | Web AR, 3D Product Preview & Interactive Brand Experiences",
  description: "B Socio builds AR websites, 3D product previews, QR catalogues, interactive brand campaigns, web-based immersive experiences, WhatsApp lead flows, and analytics-ready digital catalogues for modern businesses.",
  alternates: {
    canonical: "https://ar.bsocio.in/"
  },
  openGraph: {
    title: "B Socio AR Design Studio | Web AR & 3D Product Preview Agency",
    description: "Create premium augmented reality experiences, 3D product previews, QR catalogues, and interactive brand campaigns that customers can open directly in the browser.",
    images: ["https://ar.bsocio.in/og-image.jpg"],
    url: "https://ar.bsocio.in/",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "B Socio AR Design Studio | Web AR & 3D Product Preview Agency",
    description: "Premium AR websites, 3D previews, interactive campaigns, QR catalogues, and WhatsApp lead systems.",
    images: ["https://ar.bsocio.in/og-image.jpg"]
  }
};

const heroMetrics = [
  ["No app", "Browser-based AR and QR journeys"],
  ["3D ready", "Product preview and model guidance"],
  ["Lead first", "WhatsApp, analytics, and dashboards"]
];

const whatWeBuild = [
  {
    title: "AR websites",
    icon: ScanLine,
    text: "Web-based augmented reality experiences that open from a link, campaign QR, product page, or digital catalogue.",
    proof: "Web AR agency"
  },
  {
    title: "3D product previews",
    icon: Box,
    text: "Interactive product pages for furniture, jewellery, electronics, real estate, launches, and premium retail showcases.",
    proof: "3D product preview"
  },
  {
    title: "Interactive campaigns",
    icon: WandSparkles,
    text: "QR-led launch pages, festival campaigns, showroom experiences, event activations, and immersive brand stories.",
    proof: "AR marketing campaign"
  },
  {
    title: "QR catalogue systems",
    icon: QrCode,
    text: "Mobile-first catalogues with product details, enquiry CTAs, analytics, business dashboards, and staff workflows.",
    proof: "Interactive brand experience"
  }
];

const valuePoints = [
  ["Higher engagement", "Customers explore products instead of only scrolling static images.", Eye],
  ["Faster buying confidence", "3D and AR previews make size, detail, and context easier to understand.", ShieldCheck],
  ["Easy access", "Experiences open in the browser from QR codes, WhatsApp, ads, and social links.", Smartphone],
  ["Trackable outcomes", "Lead flows, analytics, reports, and campaign pages connect the experience to revenue.", BarChart3]
];

const useCases = [
  ["Furniture showrooms", "Let buyers preview sofas, beds, and tables with size, finish, and AR-ready product pages."],
  ["Jewellery collections", "Share premium product pages for rings, sets, bracelets, and bridal collections with direct enquiries."],
  ["Restaurants and cafes", "Launch table QR menus, special offers, catering pages, and WhatsApp enquiry paths."],
  ["Real estate launches", "Turn brochures, hoardings, and site boards into scan-ready project pages."],
  ["Retail and boutiques", "Create collection drops, new-arrival catalogues, and campaign QR pages for seasonal sales."],
  ["Brand campaigns", "Build launch microsites, interactive previews, event QR activations, and measurable landing pages."]
];

const process = [
  ["01", "Map the experience", "We define the customer journey, product categories, AR readiness, lead goals, and launch channels."],
  ["02", "Build the interface", "We create fast pages with strong hierarchy, product context, QR journeys, and tap-friendly CTAs."],
  ["03", "Add AR/3D proof", "We connect model files where available and guide model optimization when products need 3D assets."],
  ["04", "Launch and measure", "You get scan paths, WhatsApp leads, analytics, dashboards, and clean handoff for growth."]
];

const pricing = [
  ["Starter", "Rs. 1,999/month", "QR catalogue, product pages, WhatsApp leads, and mobile-first browsing."],
  ["Growth", "Rs. 5,999/month", "AR products, table QR, campaign QR pages, analytics, and reports."],
  ["Premium", "Rs. 12,999/month", "Larger catalogues, staff workflows, advanced analytics, and branded pages."]
];

const schema = [softwareApplicationSchema(), faqSchema()];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav aria-label="Primary navigation" className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/25">
              <ScanLine size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black">AR Design Studio</span>
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-amber-200">by B Socio</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="#services" className="min-h-11 rounded-lg px-3 py-3 font-bold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">Services</Link>
            <Link href="#use-cases" className="min-h-11 rounded-lg px-3 py-3 font-bold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">Use Cases</Link>
            <Button href="/pricing" variant="darkGhost">Pricing</Button>
            <Button href="/contact?source=nav" variant="gold">Book Free Consultation</Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div className="premium-grid absolute inset-0 opacity-80" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(11,16,32,0),#f6f7f4)]" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100dvh-77px)] max-w-7xl gap-10 px-5 pb-24 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="reveal-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-teal-300/25 bg-white/[0.08] px-4 py-2 text-sm font-black text-teal-100">
              <Sparkles size={16} aria-hidden="true" /> Web AR, 3D product previews, QR campaigns
            </div>
            <h1 className="max-w-5xl text-4xl font-black leading-[1.04] md:text-6xl">
              Turn your brand into an interactive AR experience customers remember.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-300">
              B Socio creates AR websites, 3D product previews, immersive QR catalogues, and interactive brand campaigns that open directly in the browser and move visitors toward real enquiries.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact?source=hero-start-project" variant="gold">Start AR Project <ArrowRight size={18} aria-hidden="true" /></Button>
              <Button href="#use-cases" variant="darkGhost">View AR Experiences</Button>
              <WhatsAppButton variant="glass">Discuss Your Idea</WhatsAppButton>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map(([label, text]) => (
                <div key={label} className="rounded-lg border border-white/[0.12] bg-white/[0.07] p-4">
                  <p className="text-xl font-black text-amber-200">{label}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-in reveal-delay-1">
            <div className="scan-frame relative overflow-hidden rounded-lg border border-white/[0.15] bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-24 bg-[linear-gradient(180deg,rgba(45,212,191,0.28),rgba(45,212,191,0))] blur-xl" aria-hidden="true" />
              <div className="relative grid min-h-[510px] place-items-center rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035))] p-5">
                <div className="scan-line absolute inset-x-8 top-1/2 h-px bg-teal-200 shadow-[0_0_32px_rgba(94,234,212,0.9)]" aria-hidden="true" />
                <div className="float-slow w-full max-w-md rounded-lg border border-white/[0.15] bg-[#111827]/90 p-5 shadow-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">Live product preview</p>
                      <h2 className="mt-2 text-2xl font-black">AR showroom card</h2>
                    </div>
                    <span className="rounded-lg bg-amber-300 px-3 py-2 text-xs font-black text-slate-950">AR ready</span>
                  </div>
                  <div className="mt-6 grid aspect-[4/3] place-items-center rounded-lg border border-teal-200/25 bg-[linear-gradient(135deg,#14213d,#11403a_55%,#3b2608)]">
                    <div className="relative h-40 w-40 rounded-lg border border-white/40 bg-white/10 shadow-2xl shadow-teal-950/30">
                      <div className="absolute -right-5 top-5 h-28 w-5 rounded-r-lg bg-white/20" />
                      <div className="absolute -bottom-5 left-5 h-5 w-28 rounded-b-lg bg-white/20" />
                      <div className="absolute inset-6 rounded-lg border border-amber-200/45" />
                      <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-100" size={54} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {[
                      ["Scan depth", "w-[86%]"],
                      ["Mobile confidence", "w-[74%]"],
                      ["Lead intent", "w-[92%]"]
                    ].map(([label, width]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300">
                          <span>{label}</span>
                          <span>Live</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.12]">
                          <div className={`meter-bar h-full rounded-full bg-teal-300 ${width}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Core outcomes" className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {valuePoints.map(([title, text, Icon]) => (
            <div key={title} className="reveal-in rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-soft">
              <Icon className="text-brand" size={28} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-black text-brand">What we build</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">A complete interactive stack for modern brand experiences.</h2>
            <p className="mt-5 text-base font-semibold leading-7 text-slate-600">
              From the first scan to the final enquiry, every page is designed to explain value quickly, feel premium on mobile, and make the next action obvious.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href="/contact?source=services" variant="accent">Book Free Consultation</Button>
              <WhatsAppButton variant="light">Discuss Your Idea</WhatsAppButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whatWeBuild.map(({ title, icon: Icon, text, proof }) => (
              <Card key={title} className="group min-h-[250px] transition duration-200 hover:-translate-y-1 hover:border-teal-200">
                <div className="flex items-center justify-between gap-4">
                  <Icon className="text-brand" size={32} aria-hidden="true" />
                  <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">{proof}</span>
                </div>
                <h3 className="mt-6 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand">
                  Explore direction <ChevronRight size={16} aria-hidden="true" />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101816] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-black text-amber-200">Why AR helps brands</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">Static catalogues show products. Immersive pages help customers feel them.</h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-300">
              AR and 3D previews reduce imagination gaps, make products easier to compare, and give campaigns a reason to be scanned, shared, and remembered.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Better customer engagement",
                "Interactive product previews",
                "Modern brand experience",
                "Higher trust before enquiry"
              ].map((item) => (
                <p key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-black">
                  <BadgeCheck className="text-teal-200" size={18} aria-hidden="true" /> {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <img
              src="/og-image.jpg"
              alt="AR Design Studio QR catalogue and AR product viewer brand preview"
              width="1200"
              height="630"
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full rounded-lg object-cover"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Scan", "Preview", "Enquire"].map((label) => (
                <div key={label} className="rounded-lg bg-white/[0.08] p-4 text-center">
                  <p className="text-2xl font-black text-amber-200">{label}</p>
                  <p className="mt-1 text-xs font-bold text-slate-300">Customer journey</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Use cases</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Designed for products, places, and campaigns people want to explore.</h2>
          </div>
          <Button href="/contact?source=use-cases" variant="light">Start AR Project</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map(([title, text]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-200 hover:shadow-soft">
              <Store className="text-accent" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="font-black text-brand">Explore QR and AR solutions by industry</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Specific pages for the businesses you sell to most.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industryPages.map((industry) => (
            <Link
              key={industry.slug}
              href={`/${industry.slug}`}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Layers3 className="text-brand" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">{industry.label}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{industry.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">
                Open page <ExternalLink size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="process" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-black text-brand">Process</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">A clear path from idea to launch.</h2>
            </div>
            <p className="text-base font-semibold leading-7 text-slate-600">
              The workflow is built for speed: define the experience, publish the right interface, connect AR/3D where it adds value, and track customer intent from day one.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {process.map(([number, title, text]) => (
              <div key={number} className="rounded-lg border border-slate-200 bg-[#f6f7f4] p-5">
                <span className="text-sm font-black text-brand">{number}</span>
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="font-black text-brand">Platform foundation</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Everything needed for a scan-to-enquiry system.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {mainFeatures.map((feature) => (
            <div key={feature} className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm font-black text-slate-700 shadow-sm transition duration-200 hover:border-teal-200">
              <CheckCircle2 className="mb-3 text-brand" size={19} aria-hidden="true" /> {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-black text-brand">Pricing</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Simple plans, clear upgrade paths.</h2>
          </div>
          <Button href="/pricing" variant="light">Full Pricing</Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {pricing.map(([name, price, text], index) => (
            <Card key={name} className={index === 1 ? "border-teal-300 ring-4 ring-teal-100" : ""}>
              <div className="flex items-center gap-3">
                <BadgeIndianRupee className="text-accent" aria-hidden="true" />
                <h3 className="text-2xl font-black">{name}</h3>
              </div>
              <p className="mt-3 text-2xl font-black text-brand">{price}</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              <Button href={`/contact?source=home-pricing-${name.toLowerCase()}`} variant={index === 1 ? "accent" : "light"} className="mt-6 w-full">
                Request {name}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="font-black text-brand">FAQ</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Questions business owners ask before launching AR.</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.slice(0, 8).map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                {question}
                <ChevronRight className="shrink-0 text-brand transition group-open:rotate-90" size={18} aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg bg-[#0b1020] p-6 text-white shadow-2xl shadow-slate-950/20 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-black text-teal-200">{BRAND.name} by {BRAND.parent}</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight md:text-5xl">Create a browser-based AR experience your customers can scan, explore, and act on.</h2>
            <p className="mt-4 font-semibold leading-7 text-slate-300">
              Email: {BRAND.email} | WhatsApp: {BRAND.phone} | Location: {BRAND.location}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button href="/contact?source=footer-consultation" variant="gold"><MessageCircle size={18} aria-hidden="true" /> Book Free Consultation</Button>
            <WhatsAppButton variant="glass">Talk on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm font-semibold text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AR Design Studio by B Socio.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/pricing" className="font-black transition hover:text-brand">Pricing</Link>
          <Link href="/contact" className="font-black transition hover:text-brand">Contact</Link>
          <Link href="/super-admin/login" className="font-black transition hover:text-brand">Super Admin</Link>
          <Link href="/team/login" className="font-black transition hover:text-brand">Team Login</Link>
          <Link href="/business/login" className="font-black transition hover:text-brand">Client Login</Link>
        </div>
      </footer>
    </main>
  );
}
