"use client";

import { useEffect } from "react";

export function trackPublicEvent(payload) {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && payload?.eventType) {
    const gaEventName = payload.eventType === "call_click" ? "phone_click" : payload.eventType;
    window.gtag("event", gaEventName, {
      business_slug: payload.businessSlug || "",
      product_slug: payload.productSlug || "",
      campaign_slug: payload.campaignSlug || "",
      table_number: payload.tableNumber || ""
    });
  }
  return fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    keepalive: true
  }).catch(() => {});
}

export function PublicTracker({ payload }) {
  useEffect(() => {
    trackPublicEvent(payload);
  }, [payload]);
  return null;
}
