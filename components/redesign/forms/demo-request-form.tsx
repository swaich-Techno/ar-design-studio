"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/redesign/ui/button";
import { site, waLink } from "@/lib/redesign/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const emptyForm = {
  businessName: "",
  businessType: "Restaurant",
  city: "",
  website: "",
  productCount: "",
  has3d: "Not sure",
  name: "",
  phone: "",
  email: "",
  companyUrl: "",
};

type FormState = typeof emptyForm;

function buildWhatsAppMessage(form: FormState, context: "project" | "ar") {
  return [
    context === "ar"
      ? "Hi B Socio AR — I want a Food AR demo."
      : "Hi B Socio, I want to know more about AR Design Studio QR catalogue and AR product viewer.",
    "",
    `Business: ${form.businessName || "Not shared"}`,
    `Type: ${form.businessType || "Not shared"}`,
    `City: ${form.city || "Not shared"}`,
    `Website/Instagram: ${form.website || "Not shared"}`,
    `Approx products: ${form.productCount || "Not shared"}`,
    `Existing 3D: ${form.has3d || "Not sure"}`,
    `Name: ${form.name || "Not shared"}`,
    `WhatsApp: ${form.phone || "Not shared"}`,
    `Email: ${form.email || "Not shared"}`,
  ].join("\n");
}

const fieldClass =
  "h-12 min-h-11 rounded-full border border-white/12 bg-[#14151a] px-4 text-[var(--fg)] placeholder:text-[var(--muted)]/70";

export function DemoRequestForm({
  context = "project",
}: {
  context?: "project" | "ar";
}) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    businessType: context === "ar" ? "Restaurant" : "",
  });
  const [source, setSource] = useState(context === "ar" ? "ar-demo" : "direct");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get("source");
    const storedSource = window.localStorage.getItem("arStudioLeadSource");
    setSource(urlSource || storedSource || document.referrer || (context === "ar" ? "ar-demo" : "direct"));
  }, [context]);

  const whatsappUrl = useMemo(
    () => waLink(context === "ar" ? site.whatsapp.ar : site.whatsapp.main, buildWhatsAppMessage(form, context)),
    [form, context],
  );

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.businessName.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Business name, your name, email, and WhatsApp number are required.");
      window.gtag?.("event", "form_error", { form_name: "contact_demo", source, reason: "missing_required_fields" });
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const industry = form.businessType || "Restaurant";
      const message = [
        `City: ${form.city || "Not shared"}`,
        `Website/Instagram: ${form.website || "Not shared"}`,
        `Approx products: ${form.productCount || "Not shared"}`,
        `Existing 3D: ${form.has3d || "Not sure"}`,
      ].join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          name: form.name,
          email: form.email,
          phone: form.phone,
          industry,
          message,
          source,
          city: form.city,
          website: form.website,
          productCount: form.productCount,
          has3d: form.has3d,
          companyUrl: form.companyUrl,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        emailSent?: boolean;
        message?: string;
      };
      if (!response.ok) {
        setError(data.error || "Demo request could not be saved. Please try again or contact us on WhatsApp.");
        window.gtag?.("event", "form_error", {
          form_name: "contact_demo",
          source,
          reason: data.error || "request_failed",
        });
        return;
      }
      window.gtag?.("event", "contact_form_submit", { form_name: "contact_demo", source });
      const delivery =
        data.emailSent === false
          ? " It is saved for review, but email delivery needs Vercel/Resend settings checked."
          : "";
      setSuccess(`${data.message || "Request saved. We will follow up by email or WhatsApp."}${delivery}`);
      setForm({ ...emptyForm, businessType: context === "ar" ? "Restaurant" : "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Demo request could not be saved. Please try again or contact us on WhatsApp.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <input type="hidden" name="source" value={source} />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Company URL
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.companyUrl}
            onChange={(event) => update("companyUrl", event.target.value)}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Business name
        <input
          className={fieldClass}
          name="organization"
          autoComplete="organization"
          placeholder="Shop, restaurant, or brand"
          value={form.businessName}
          onChange={(event) => update("businessName", event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        Business type
        <select
          className={fieldClass}
          name="industry"
          value={form.businessType}
          onChange={(event) => update("businessType", event.target.value)}
        >
          <option value="Restaurant">Restaurant</option>
          <option value="Café">Café</option>
          <option value="Hotel">Hotel</option>
          <option value="Catering">Catering</option>
          <option value="Food">Food</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        City
        <input
          className={fieldClass}
          name="city"
          autoComplete="address-level2"
          placeholder="City"
          value={form.city}
          onChange={(event) => update("city", event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Website or Instagram
        <input
          className={fieldClass}
          name="website"
          autoComplete="url"
          placeholder="instagram.com/yourshop"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Approx. products
        <input
          className={fieldClass}
          name="productCount"
          inputMode="numeric"
          placeholder="e.g. 8 hero pieces"
          value={form.productCount}
          onChange={(event) => update("productCount", event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Existing 3D files?
        <select
          className={fieldClass}
          name="has3d"
          value={form.has3d}
          onChange={(event) => update("has3d", event.target.value)}
        >
          <option>Yes</option>
          <option>No</option>
          <option>Not sure</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Your name
        <input
          className={fieldClass}
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        WhatsApp
        <input
          className={fieldClass}
          name="tel"
          autoComplete="tel"
          placeholder="+91 70094 64475"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        Email
        <input
          className={fieldClass}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email for follow-up"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          required
        />
      </label>
      <div aria-live="polite" className="grid gap-3">
        {success ? (
          <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant={context === "ar" ? "gold" : "primary"} disabled={submitting}>
          {submitting ? "Saving request..." : "Request My Demo"}
        </Button>
        <Button asChild variant="ghost">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Talk on WhatsApp
          </a>
        </Button>
      </div>
    </form>
  );
}
