import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/marketing";

const variants = {
  primary: "bg-green-600 text-white shadow-lg shadow-green-900/15 hover:bg-green-700",
  dark: "bg-ink text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800",
  light: "border border-slate-200 bg-white text-ink hover:bg-slate-50"
};

export function WhatsAppButton({ children = "Talk on WhatsApp", variant = "primary", className = "", source = "whatsapp-button" }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      data-track-event="whatsapp_click"
      data-track-source={source}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${variants[variant] || variants.primary} ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" focusable="false" /> {children}
    </a>
  );
}
