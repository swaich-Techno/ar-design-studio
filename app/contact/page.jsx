import { BadgeCheck, Mail, MessageCircle, Phone, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContactDemoForm } from "@/components/forms/ContactDemoForm";

const demoSteps = [
  ["1", "Share business details", "Tell us your category, catalogue size, and WhatsApp number."],
  ["2", "Get the right setup", "We suggest QR flow, AR model needs, plan, and add-ons."],
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
    <main className="min-h-screen bg-surface px-5 py-8 text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section>
          <Button href="/" variant="ghost">Back</Button>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
            <Sparkles size={16} /> Free AR catalogue demo
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-ink md:text-6xl">
            Get a scan-ready demo before you sell the full package.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Share your business or client details. We will reply with the right QR flow, AR model guidance, pricing direction, and launch checklist.
          </p>

          <div className="mt-8 grid gap-3">
            {trust.map((item) => (
              <p key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black shadow-sm">
                <BadgeCheck className="text-brand" size={19} /> {item}
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
              <ScanLine className="text-teal-200" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Request demo</p>
            </div>
            <h2 className="mt-3 text-3xl font-black">Tell us what you sell</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">The form sends your request to the AR Design Studio team with visible success or failure feedback.</p>
          </div>
          <ContactDemoForm />
          <div className="mt-6 grid gap-3 text-sm font-bold sm:grid-cols-3">
            <p className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-teal-800"><MessageCircle size={17} /> WhatsApp leads</p>
            <p className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700"><Phone size={17} /> Call tracking</p>
            <p className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-orange-800"><Mail size={17} /> Email follow-up</p>
          </div>
        </Card>
      </div>
    </main>
  );
}
