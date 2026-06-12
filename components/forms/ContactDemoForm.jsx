"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const demoWhatsAppNumber = process.env.NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER || "917009464475";

const emptyForm = {
  businessName: "",
  name: "",
  email: "",
  phone: "",
  industry: "",
  message: ""
};

function buildMessage(form) {
  return [
    "Hi B Socio, I want to know more about AR Design Studio QR catalogue and AR product viewer.",
    "",
    `Business: ${form.businessName || "Not shared"}`,
    `Name: ${form.name || "Not shared"}`,
    `Email: ${form.email || "Not shared"}`,
    `Phone/WhatsApp: ${form.phone || "Not shared"}`,
    `Industry: ${form.industry || "Not shared"}`,
    `Requirement: ${form.message || "Not shared"}`
  ].join("\n");
}

export function ContactDemoForm() {
  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const whatsappUrl = useMemo(() => (
    `https://wa.me/${demoWhatsAppNumber}?text=${encodeURIComponent(buildMessage(form))}`
  ), [form]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Name, email, and phone or WhatsApp number are required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Demo request could not be saved. Please try again or contact us on WhatsApp.");
        return;
      }
      const delivery = data.emailSent === false ? " It is saved in Super Admin, but email delivery needs Vercel/Resend settings checked." : "";
      setSuccess(`${data.message || "Demo request saved for Super Admin approval."}${delivery}`);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Demo request could not be saved. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input className="field" placeholder="Business name" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
      <input className="field" placeholder="Your name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      <input className="field" type="email" placeholder="Email for demo approval" value={form.email} onChange={(event) => update("email", event.target.value)} required />
      <input className="field" placeholder="Phone / WhatsApp" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
      <input className="field" placeholder="Industry" value={form.industry} onChange={(event) => update("industry", event.target.value)} />
      <textarea className="field min-h-28" placeholder="Products, catalogue size, and AR model status" value={form.message} onChange={(event) => update("message", event.target.value)} />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={submitting}><MessageCircle size={18} /> {submitting ? "Saving request..." : "Request free demo"}</Button>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-center text-sm font-black text-brand">
        Prefer direct chat? Open WhatsApp: +91 70094 64475
      </a>
    </form>
  );
}
