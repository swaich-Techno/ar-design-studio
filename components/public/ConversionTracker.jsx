"use client";

import { useEffect } from "react";

function sendEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export function ConversionTracker() {
  useEffect(() => {
    let trackedScroll = false;

    function onClick(event) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest("[data-track-event]");
      if (!target) return;

      const eventName = target.getAttribute("data-track-event");
      const source = target.getAttribute("data-track-source") || "";
      if (source) {
        window.localStorage.setItem("arStudioLeadSource", source);
      }
      sendEvent(eventName, {
        source,
        link_url: target.getAttribute("href") || "",
        link_text: target.textContent?.trim() || ""
      });
    }

    function onScroll() {
      if (trackedScroll) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress >= 0.75) {
        trackedScroll = true;
        sendEvent("scroll_75", { page_path: window.location.pathname });
      }
    }

    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
