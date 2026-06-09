"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const demoWhatsAppNumber = process.env.NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER || "917355008986";

const emptyForm = {
  businessName: "",
  name: "",
  email: "",
  phone: "",
  industry: "",
  message: ""
};

const fields = [
  {
    name: "businessName",
    label: "Business name",
    autoComplete: "organization"
  },
  {
    name: "name",
    label: "Your name",
    autoComplete: "name",
    required: true
  },
  {
    name: "email",
    label: "Email for demo approval",
    type: "email",
    autoComplete: "email",
    required: true
  },
  {
    name: "phone",
    label: "Phone or WhatsApp number",
    type: "tel",
    autoComplete: "tel",
    required: true
  },
  {
    name: "industry",
    label: "Industry",
    autoComplete: "organization-title"
  }
];

function buildMessage(form) {
  return [
    "Hi B Socio, I want to discuss an AR website, 3D product preview, QR catalogue, or interactive brand experience.",
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
      {fields.map(({ name, label, type = "text", autoComplete, required }) => (
        <label key={name} className="grid gap-2 text-sm font-black text-ink" htmlFor={`demo-${name}`}>
          {label}{required ? <span className="sr-only"> required</span> : null}
          <input
            id={`demo-${name}`}
            className="field"
            type={type}
            value={form[name]}
            autoComplete={autoComplete}
            onChange={(event) => update(name, event.target.value)}
            required={required}
          />
        </label>
      ))}
      <label className="grid gap-2 text-sm font-black text-ink" htmlFor="demo-message">
        Products, catalogue size, and AR model status
        <textarea
          id="demo-message"
          className="field min-h-28"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
        />
      </label>
      <div aria-live="polite" className="grid gap-3">
        {success ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{success}</p> : null}
        {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
      </div>
      <Button type="submit" variant="accent" disabled={submitting}><MessageCircle size={18} aria-hidden="true" /> {submitting ? "Saving request..." : "Request free demo"}</Button>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 text-center text-sm font-black text-brand transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        Prefer direct chat? Open WhatsApp: +91 73550 08986
      </a>
    </form>
  );
}
