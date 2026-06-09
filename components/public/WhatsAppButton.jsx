import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/marketing";

const variants = {
  primary: "bg-green-600 text-white shadow-lg shadow-green-950/20 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-xl",
  dark: "bg-ink text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-xl",
  light: "border border-slate-200 bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50",
  glass: "border border-white/[0.15] bg-white/10 text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-white/[0.15]"
};

export function WhatsAppButton({ children = "Talk on WhatsApp", variant = "primary", className = "" }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 motion-reduce:transform-none ${variants[variant] || variants.primary} ${className}`}
    >
      <MessageCircle size={18} /> {children}
    </a>
  );
}
