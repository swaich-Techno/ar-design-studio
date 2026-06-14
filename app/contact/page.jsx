import { BadgeCheck, MessageCircle, Phone, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContactDemoForm } from "@/components/forms/ContactDemoForm";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BRAND, contactPageSchema, localBusinessSchema } from "@/lib/marketing";

export const metadata = {
  title: "Contact B Socio AR Studio | Book a Free Demo",
  description: "Book a free demo for QR catalogues, AR product viewers and interactive digital experiences for your business.",
  alternates: { canonical: "https://ar.bsocio.in/contact" },
  openGraph: {
    title: "Contact B Socio AR Studio | Book a Free Demo",
    description: "Book a free demo for QR catalogues, AR product viewers and interactive digital experiences for your business.",
    url: "https://ar.bsocio.in/contact",
    images: ["https://ar.bsocio.in/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact B Socio AR Studio | Book a Free Demo",
    description: "Book a free demo for QR catalogues, AR product viewers and interactive digital experiences for your business.",
    images: ["https://ar.bsocio.in/og-image.jpg"]
  }
};

const demoSteps = [
  ["1", "Share business details", "Tell us your category, catalogue size, and WhatsApp number."],
  ["2", "Admin approval", "Super Admin can approve a one-product AR demo workspace."],
  ["3", "Launch sample page", "Use one demo product page to show customers and close the client."]
];

const trust = [
  "WhatsApp-first lead flow",
  "Product QR, catalogue QR, table QR, and campaign QR",
  "AR/3D guidance for GLB and USDZ models",
  "Vercel, MongoDB, Cloudinary, and analytics-ready setup"
];

const schema = [contactPageSchema(), localBusinessSchema()];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface px-5 py-8 text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Contact navigation">
          <Button href="/" variant="ghost">Back</Button>
          <div className="flex flex-wrap gap-2">
            <Button href="/pricing" variant="light">Pricing</Button>
            <WhatsAppButton source="contact-header">Talk on WhatsApp</WhatsAppButton>
          </div>
        </nav>
      </header>

      <main id="main-content" className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            <Sparkles size={16} aria-hidden="true" focusable="false" /> Free AR catalogue demo
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-ink md:text-6xl">
            Book a free QR and AR catalogue demo.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Share your business details and B Socio will help you choose the right QR catalogue, AR product viewer, WhatsApp enquiry flow, and launch checklist.
            Most demo requests are reviewed from the Super Admin inbox, then followed up by email or WhatsApp with the next step.
          </p>

          <div className="mt-8 grid gap-3">
            {trust.map((item) => (
              <p key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black shadow-sm">
                <BadgeCheck className="text-brand" size={19} aria-hidden="true" focusable="false" /> {item}
              </p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {demoSteps.map(([number, title, text]) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-black text-white">{number}</span>
                <h2 className="mt-4 font-black">{title}</h2>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="p-5 md:p-7">
          <div className="mb-6 rounded-[24px] bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <ScanLine className="text-teal-200" aria-hidden="true" focusable="false" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Request demo</p>
            </div>
            <h2 className="mt-3 text-3xl font-black">Tell us what you sell</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">The form saves a demo request for Super Admin review and can also be followed up on WhatsApp.</p>
          </div>
          <ContactDemoForm />
          <div className="mt-6 grid gap-3 text-sm font-bold sm:grid-cols-3">
            <p className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-teal-800"><MessageCircle size={17} aria-hidden="true" focusable="false" /> WhatsApp leads</p>
            <p className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700"><Phone size={17} aria-hidden="true" focusable="false" /> Call tracking</p>
            <p className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-orange-800"><MessageCircle size={17} aria-hidden="true" focusable="false" /> Direct demo chat</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <h2 className="font-black">{BRAND.name} by {BRAND.parent}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Email: <a href={`mailto:${BRAND.email}`} data-track-event="email_click" data-track-source="contact-card" className="font-black text-brand">{BRAND.email}</a></p>
            <p className="text-sm font-semibold leading-6 text-slate-600">Phone/WhatsApp: <a href={`tel:${BRAND.phoneCompact}`} data-track-event="phone_click" data-track-source="contact-card" className="font-black text-brand">{BRAND.phone}</a></p>
            <p className="text-sm font-semibold leading-6 text-slate-600">Location: {BRAND.location}</p>
            <WhatsAppButton className="mt-4" source="contact-card">Talk on WhatsApp</WhatsAppButton>
          </div>
        </Card>
      </main>

      <footer className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-slate-200 py-8 text-sm font-semibold text-slate-600">
        <p className="font-black text-ink">{BRAND.fullName}</p>
        <p>Email: {BRAND.email} | Phone/WhatsApp: {BRAND.phone} | Service area: {BRAND.location}</p>
      </footer>
    </div>
  );
}
