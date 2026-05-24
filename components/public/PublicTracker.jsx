"use client";

import { useEffect } from "react";

export function trackPublicEvent(payload) {
  return fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {});
}

export function PublicTracker({ payload }) {
  useEffect(() => {
    trackPublicEvent(payload);
  }, [payload]);
  return null;
}
