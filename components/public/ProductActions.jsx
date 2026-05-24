"use client";

import { MapPin, Phone, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackPublicEvent } from "@/components/public/PublicTracker";

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function ProductActions({ business, product, tableNumber, campaignTitle }) {
  const price = product.discountPrice || product.price || 0;
  const basePayload = { businessSlug: business.slug, productSlug: product.slug };
  const message = tableNumber
    ? `Hello, I want to order ${product.name} from ${business.businessName}. Table Number: ${tableNumber}. Please confirm availability.`
    : campaignTitle
      ? `Hello, I am interested in ${campaignTitle} offer from ${business.businessName}. Please share details.`
      : `Hello, I am interested in ${product.name} from ${business.businessName}. Price: ${price}. Please share more details.`;
  const whatsapp = `https://wa.me/${cleanPhone(business.whatsapp)}?text=${encodeURIComponent(message)}`;

  async function share() {
    trackPublicEvent({ ...basePayload, eventType: "share_click" });
    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.shortDescription || product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Product link copied.");
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackPublicEvent({ ...basePayload, eventType: "whatsapp_click" })}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white"
      >
        <MessageCircle size={18} /> Order on WhatsApp
      </a>
      {business.phone ? (
        <a
          href={`tel:${business.phone}`}
          onClick={() => trackPublicEvent({ ...basePayload, eventType: "call_click" })}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
        >
          <Phone size={18} /> Call Now
        </a>
      ) : null}
      {business.mapLink ? (
        <a
          href={business.mapLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackPublicEvent({ businessSlug: business.slug, eventType: "location_click" })}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-ink"
        >
          <MapPin size={18} /> View Location
        </a>
      ) : null}
      <Button type="button" variant="light" onClick={share}><Share2 size={18} /> Share Product</Button>
    </div>
  );
}
