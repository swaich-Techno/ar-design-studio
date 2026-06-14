"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [source, setSource] = useState("direct");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get("source");
    const storedSource = window.localStorage.getItem("arStudioLeadSource");
    setSource(urlSource || storedSource || document.referrer || "direct");
  }, []);

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
      if (typeof window.gtag === "function") {
        window.gtag("event", "form_error", { form_name: "contact_demo", source, reason: "missing_required_fields" });
      }
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Demo request could not be saved. Please try again or contact us on WhatsApp.");
        if (typeof window.gtag === "function") {
          window.gtag("event", "form_error", { form_name: "contact_demo", source, reason: data.error || "request_failed" });
        }
        return;
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "contact_form_submit", { form_name: "contact_demo", source });
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
      <input type="hidden" name="source" value={source} />
      <label className="form-label">
        Business name
        <input className="field" name="organization" autoComplete="organization" placeholder="Business name" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
      </label>
      <label className="form-label">
        Your name
        <input className="field" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      </label>
      <label className="form-label">
        Email for demo approval
        <input className="field" type="email" name="email" autoComplete="email" placeholder="Email for demo approval" value={form.email} onChange={(event) => update("email", event.target.value)} required />
      </label>
      <label className="form-label">
        Phone or WhatsApp
        <input className="field" name="tel" autoComplete="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
      </label>
      <label className="form-label">
        Industry
        <input className="field" name="industry" autoComplete="organization-title" placeholder="Industry" value={form.industry} onChange={(event) => update("industry", event.target.value)} />
      </label>
      <label className="form-label">
        Products, catalogue size, and AR model status
        <textarea className="field min-h-28" name="message" placeholder="Products, catalogue size, and AR model status" value={form.message} onChange={(event) => update("message", event.target.value)} />
      </label>
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={submitting} data-track-event="demo_request_click" data-track-source={source}>
        <MessageCircle size={18} aria-hidden="true" focusable="false" /> {submitting ? "Saving request..." : "Request free demo"}
      </Button>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" data-track-event="whatsapp_click" data-track-source="contact-direct-chat" className="text-center text-sm font-black text-brand">
        Prefer direct chat? Open WhatsApp: +91 70094 64475
      </a>
    </form>
  );
}
