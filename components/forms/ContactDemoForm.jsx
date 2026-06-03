"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const demoWhatsAppNumber = process.env.NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER || "919781580475";

const emptyForm = {
  businessName: "",
  name: "",
  phone: "",
  industry: "",
  message: ""
};

function buildMessage(form) {
  return [
    "Hello AR Design Studio, I want a free AR catalogue demo.",
    "",
    `Business: ${form.businessName || "Not shared"}`,
    `Name: ${form.name || "Not shared"}`,
    `Phone/WhatsApp: ${form.phone || "Not shared"}`,
    `Industry: ${form.industry || "Not shared"}`,
    `Requirement: ${form.message || "Not shared"}`
  ].join("\n");
}

export function ContactDemoForm() {
  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const whatsappUrl = useMemo(() => (
    `https://wa.me/${demoWhatsAppNumber}?text=${encodeURIComponent(buildMessage(form))}`
  ), [form]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone or WhatsApp number are required.");
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSuccess("WhatsApp opened with your demo request. Send the message there and we will reply soon.");
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input className="field" placeholder="Business name" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
      <input className="field" placeholder="Your name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      <input className="field" placeholder="Phone / WhatsApp" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
      <input className="field" placeholder="Industry" value={form.industry} onChange={(event) => update("industry", event.target.value)} />
      <textarea className="field min-h-28" placeholder="Products, catalogue size, and AR model status" value={form.message} onChange={(event) => update("message", event.target.value)} />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent"><MessageCircle size={18} /> Send on WhatsApp</Button>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-center text-sm font-black text-brand">
        Or open WhatsApp directly: +91 97815 80475
      </a>
    </form>
  );
}
