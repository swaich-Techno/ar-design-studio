import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BRAND, breadcrumbSchema, canonical, faqSchema, industryPages, mainFeatures, serviceSchema } from "@/lib/marketing";

function relatedIndustries(currentSlug) {
  return industryPages.filter((item) => item.slug !== currentSlug).slice(0, 4);
}

function pageFaq(page) {
  return [
    [`Can ${page.label.toLowerCase()} use AR Design Studio?`, `Yes. ${page.label} can use AR Design Studio to create QR catalogue pages, share product details, and collect WhatsApp enquiries.`],
    ["Do customers need to install an app?", "No. Customers scan a QR code or open a link in their mobile browser."],
    ["Can I update products and prices?", "Yes. Product photos, prices, descriptions, offers, and availability can be managed from the business dashboard."],
    ["Can customers enquire on WhatsApp?", "Yes. WhatsApp enquiry buttons can include the catalogue or product context for faster follow-up."]
  ];
}

export function IndustryLandingPage({ page }) {
  const faqs = pageFaq(page);
  const schema = [
    serviceSchema(page),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: canonical("/") },
      { name: page.label, url: canonical(`/${page.slug}`) }
    ])
  ];

  return (
    <div className="min-h-screen bg-surface text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header>
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5" aria-label={`${page.label} page navigation`}>
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white"><Home size={18} aria-hidden="true" focusable="false" /></span>
            AR Design Studio
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button href="/pricing" variant="ghost">Pricing</Button>
            <Button href="/contact" variant="light" data-track-event="industry_page_cta_click" data-track-source={`${page.slug}-nav`}>Contact</Button>
            <WhatsAppButton source={`${page.slug}-nav`}>Talk on WhatsApp</WhatsAppButton>
          </div>
        </nav>
      </header>

      <main id="main-content">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            <Sparkles size={16} aria-hidden="true" focusable="false" /> QR and AR solution for {page.label}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">{page.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600">{page.intro}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton source={`${page.slug}-hero`}>Create My Digital Catalogue</WhatsAppButton>
            <Button href="/pricing" variant="light">See Pricing</Button>
            <Button href="/contact" variant="accent" data-track-event="industry_page_cta_click" data-track-source={`${page.slug}-demo`}>Get QR Catalogue Demo <ArrowRight size={18} aria-hidden="true" focusable="false" /></Button>
          </div>
        </div>

        <Card className="bg-ink text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-200">{BRAND.name} by {BRAND.parent}</p>
          <h2 className="mt-3 text-3xl font-black">Scan-ready catalogue pages for local business buyers.</h2>
          <div className="mt-6 grid gap-3">
            {page.benefits.map((benefit) => (
              <p key={benefit} className="flex gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold leading-6 text-slate-100">
                <BadgeCheck className="mt-0.5 shrink-0 text-teal-200" size={18} aria-hidden="true" focusable="false" /> {benefit}
              </p>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <p className="font-black text-brand">Industry problem</p>
            <h2 className="mt-2 text-2xl font-black">Customers need fast product clarity</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              {page.label} often depend on WhatsApp messages, printed catalogues, loose photos, and repeated explanations. A scan-ready QR catalogue gives customers one mobile page with products, prices, offers, visuals, and a direct enquiry action.
            </p>
          </Card>
          <Card>
            <p className="font-black text-brand">B Socio solution</p>
            <h2 className="mt-2 text-2xl font-black">One catalogue link for every buyer</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              AR Design Studio by B Socio turns your catalogue into structured product pages that are easy to share, easy to scan, and simple to update from the business dashboard. Selected products can also include AR or 3D previews.
            </p>
          </Card>
          <Card>
            <p className="font-black text-brand">Customer journey</p>
            <h2 className="mt-2 text-2xl font-black">Scan, view, decide, enquire</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              A customer scans a QR code, opens the {page.label.toLowerCase()} catalogue, compares products, checks important details, and taps WhatsApp with the product context already included for quicker follow-up.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-black text-brand">Use cases</p>
            <h2 className="mt-2 text-3xl font-black">What you can publish</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.useCases.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5">
          <p className="font-black text-brand">Features</p>
          <h2 className="mt-2 text-3xl font-black">Built for mobile enquiries</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...page.features, ...mainFeatures.slice(0, 4)].slice(0, 9).map((item) => (
            <Card key={item}>
              <CheckCircle2 className="text-brand" />
              <h3 className="mt-4 font-black">{item}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Designed to help customers scan, understand, and enquire without friction.</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <Card className="grid gap-6 bg-white lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-black text-brand">FAQ</p>
            <h2 className="mt-2 text-3xl font-black">Common questions</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black">{question}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-black text-brand">Related industries</p>
            <h2 className="mt-2 text-3xl font-black">Explore more QR and AR pages</h2>
          </div>
          <Button href="/" variant="light">Back to Homepage</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relatedIndustries(page.slug).map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 font-black text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-brand">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <Card className="grid gap-5 bg-ink text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-black text-teal-200">{BRAND.name} by {BRAND.parent}</p>
            <h2 className="mt-2 text-3xl font-black">Need a custom QR/AR setup for your business?</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">{BRAND.email} - {BRAND.phone} - {BRAND.location}</p>
          </div>
          <WhatsAppButton variant="light" source={`${page.slug}-footer`}>Talk on WhatsApp</WhatsAppButton>
        </Card>
      </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-10 text-sm font-semibold text-slate-600">
        <p className="font-black text-ink">{BRAND.fullName}</p>
        <p>Email: {BRAND.email} | Phone/WhatsApp: {BRAND.phone} | Service area: {BRAND.location}</p>
      </footer>
    </div>
  );
}
