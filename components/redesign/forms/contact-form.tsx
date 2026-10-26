"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/redesign/ui/button";
import { site, waLink } from "@/lib/redesign/site";

export function ContactForm({
  context = "project",
}: {
  context?: "project" | "ar" | "jewellery" | "food";
}) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const number = context === "project" ? site.whatsapp.main : site.whatsapp.ar;

  const href = useMemo(() => {
    const text = [
      `Hello B Socio${context === "project" ? "" : " AR"},`,
      name ? `I'm ${name}.` : "",
      business ? `Business: ${business}.` : "",
      `Interest: ${context}.`,
      message || "I'd like to talk.",
    ]
      .filter(Boolean)
      .join(" ");
    return waLink(number, text);
  }, [name, business, message, context, number]);

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <label className="grid gap-2 text-sm">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-full border border-white/12 bg-white/5 px-4"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Business
        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="h-12 rounded-full border border-white/12 bg-white/5 px-4"
        />
      </label>
      <label className="grid gap-2 text-sm">
        What should we experience?
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="rounded-3xl border border-white/12 bg-white/5 px-4 py-3"
        />
      </label>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit">Send on WhatsApp</Button>
        <Button asChild variant="ghost">
          <a href={`mailto:${site.email}`}>Email {site.email}</a>
        </Button>
      </div>
    </form>
  );
}
