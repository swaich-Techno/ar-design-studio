"use client";

import { MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackPublicEvent } from "@/components/public/PublicTracker";

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function ProductActions({ business, product, tableNumber, campaignTitle }) {
  const price = product.discountPrice || product.price || 0;
  const basePayload = { businessSlug: business.slug, productSlug: product.slug };
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
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
    <div className="grid gap-3">
      {outOfStock ? (
        <span className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-200 px-5 py-4 text-sm font-black text-slate-600">
          <MessageCircle size={18} /> Currently out of stock
        </span>
      ) : (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackPublicEvent({ ...basePayload, eventType: "whatsapp_click" })}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-green-700"
        >
          <MessageCircle size={18} /> Order or enquire on WhatsApp
        </a>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {business.phone ? (
          <a
            href={`tel:${business.phone}`}
            onClick={() => trackPublicEvent({ ...basePayload, eventType: "call_click" })}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
          >
            <Phone size={18} /> Call
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
            <MapPin size={18} /> Location
          </a>
        ) : null}
        <Button type="button" variant="light" onClick={share} className="w-full"><Share2 size={18} /> Share</Button>
      </div>
      <p className="rounded-2xl bg-teal-50 px-4 py-3 text-xs font-bold leading-5 text-teal-800">
        Fastest response is on WhatsApp. Your product link and price are included automatically.
      </p>
    </div>
  );
}
