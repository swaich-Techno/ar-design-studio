"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const emptyForm = {
  businessName: "",
  name: "",
  email: "",
  phone: "",
  industry: "",
  message: ""
};

export function ContactDemoForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setWarning("");
    setError("");

    let response;
    let data = {};

    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      data = await response.json().catch(() => ({}));
    } catch {
      setLoading(false);
      setError("Request could not reach the server. Please check the deployment and try again.");
      return;
    }

    if (!response.ok) {
      setLoading(false);
      setError(data.error || "Request could not be sent. Please try again.");
      if (data.emailError || data.ticketError) {
        setWarning([data.emailError, data.ticketError].filter(Boolean).join(" "));
      }
      return;
    }

    setLoading(false);
    setForm(emptyForm);
    setSuccess(data.message || "Demo request received. We will contact you soon.");
    if (data.emailSent === false) {
      setWarning(data.emailError || "Email was not sent. Check RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in Vercel.");
    } else if (data.ticketSaved === false && data.ticketError) {
      setWarning(`Email was sent, but the support ticket was not saved: ${data.ticketError}`);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input className="field" placeholder="Business name" value={form.businessName} onChange={(event) => update("businessName", event.target.value)} />
      <input className="field" placeholder="Your name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(event) => update("email", event.target.value)} />
      <input className="field" placeholder="Phone / WhatsApp" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
      <input className="field" placeholder="Industry" value={form.industry} onChange={(event) => update("industry", event.target.value)} />
      <textarea className="field min-h-28" placeholder="Products, catalogue size, and AR model status" value={form.message} onChange={(event) => update("message", event.target.value)} />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{success}</p> : null}
      {warning ? <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-black text-orange-700">Email alert issue: {warning}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>{loading ? "Sending..." : "Send Request"}</Button>
    </form>
  );
}
