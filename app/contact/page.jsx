import { BadgeCheck, MessageCircle, Phone, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContactDemoForm } from "@/components/forms/ContactDemoForm";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BRAND } from "@/lib/marketing";

export const metadata = {
  title: "Contact AR Design Studio | Get QR Catalogue Demo",
  description: "Contact AR Design Studio by B Socio for QR catalogue, AR product viewer, QR menu, campaign QR pages, WhatsApp enquiry system, and digital catalogue setup in India.",
  alternates: { canonical: "https://ar.bsocio.in/contact" },
  openGraph: {
    title: "Contact AR Design Studio",
    description: "Get a QR catalogue and AR product viewer demo for your local business.",
    url: "https://ar.bsocio.in/contact",
    images: ["https://ar.bsocio.in/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AR Design Studio",
    description: "Get a QR catalogue and AR product viewer demo for your local business.",
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-8 text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section>
          <Button href="/" variant="ghost">Back</Button>
          <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            <Sparkles size={16} aria-hidden="true" /> Free AR catalogue demo
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-ink md:text-6xl">
            Get a scan-ready demo before you sell the full package.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Share your business or client details. We will reply with the right QR flow, AR model guidance, pricing direction, and launch checklist.
          </p>

          <div className="mt-8 grid gap-3">
            {trust.map((item) => (
              <p key={item} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-black shadow-sm">
                <BadgeCheck className="text-brand" size={19} aria-hidden="true" /> {item}
              </p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {demoSteps.map(([number, title, text]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-black text-white">{number}</span>
                <h2 className="mt-4 font-black">{title}</h2>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="p-5 md:p-7">
          <div className="mb-6 rounded-lg bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <ScanLine className="text-teal-200" aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Request demo</p>
            </div>
            <h2 className="mt-3 text-3xl font-black">Tell us what you sell</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">The form saves a demo request for Super Admin review and can also be followed up on WhatsApp.</p>
          </div>
          <ContactDemoForm />
          <div className="mt-6 grid gap-3 text-sm font-bold sm:grid-cols-3">
            <p className="flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-3 text-teal-800"><MessageCircle size={17} aria-hidden="true" /> WhatsApp leads</p>
            <p className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-slate-700"><Phone size={17} aria-hidden="true" /> Call tracking</p>
            <p className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-orange-800"><MessageCircle size={17} aria-hidden="true" /> Direct demo chat</p>
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-5">
            <h2 className="font-black">{BRAND.name} by {BRAND.parent}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Email: {BRAND.email}</p>
            <p className="text-sm font-semibold leading-6 text-slate-600">WhatsApp: {BRAND.phone}</p>
            <p className="text-sm font-semibold leading-6 text-slate-600">Location: {BRAND.location}</p>
            <WhatsAppButton className="mt-4">Talk on WhatsApp</WhatsAppButton>
          </div>
        </Card>
      </div>
    </main>
  );
}
