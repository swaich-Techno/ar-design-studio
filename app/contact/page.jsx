import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Button href="/" variant="ghost">Back</Button>
          <h1 className="mt-8 text-4xl font-black md:text-6xl">Get Free Demo</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Tell us your industry, catalogue size, and AR requirements. We will help you launch QR pages that work in mobile browsers.</p>
          <div className="mt-8 space-y-4 text-sm font-bold">
            <p className="flex items-center gap-3"><MessageCircle className="text-brand" /> WhatsApp demo and setup</p>
            <p className="flex items-center gap-3"><Phone className="text-brand" /> Phone support for onboarding</p>
            <p className="flex items-center gap-3"><Mail className="text-brand" /> Deployment and MongoDB/Vercel help</p>
          </div>
        </div>
        <Card>
          <form className="grid gap-4">
            <input className="field" placeholder="Business name" />
            <input className="field" placeholder="Your name" />
            <input className="field" placeholder="Phone / WhatsApp" />
            <input className="field" placeholder="Industry" />
            <textarea className="field min-h-32" placeholder="Products, catalogue size, and AR model status" />
            <Button type="button" variant="accent">Send Request</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
