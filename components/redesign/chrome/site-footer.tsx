import Link from "next/link";
import { site, waLink } from "@/lib/redesign/site";

export function SiteFooter({ ar }: { ar: boolean }) {
  return (
    <footer className="relative border-t border-white/8 px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-tight">
            {ar ? "Your menu should do more than list food." : "Creative technology that turns attention into interaction."}
          </p>
          <p className="mt-4 max-w-md text-sm text-muted">
            {ar ? "B Socio AR — Food AR and interactive menus." : "B Socio"} · {site.location} · {site.email} · {site.phoneDisplay}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">Browser-based • No customer app required</p>
        </div>
        <div className="text-sm">
          <p className="kicker mb-4">Food AR</p>
          <div className="flex flex-col gap-2 text-[var(--fg)]/80">
            <Link href="/ar/food">Food</Link>
            <Link href="/ar/demo">Demo</Link>
            <Link href="/ar/create">Photo studio · experimental</Link>
            <Link href="/ar/pricing">Pricing</Link>
            <Link href="/ar/how-it-works">How it works</Link>
            <Link href="/ar/food-businesses">Food businesses</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="kicker mb-4 opacity-60">Studio</p>
          <div className="flex flex-col gap-2 text-[var(--fg)]/55">
            <a href="https://bsocio.in" rel="noreferrer">
              B Socio
            </a>
            <Link href="/work">Work</Link>
            <Link href="/capabilities">Capabilities</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col gap-3 border-t border-white/8 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} B Socio AR</p>
        <div className="flex flex-wrap gap-5">
          <a href={waLink(ar ? site.whatsapp.ar : site.whatsapp.main, "Hello from the website.")}>
            Talk on WhatsApp
          </a>
          <a href={site.production.clientLogin} className="opacity-60 hover:opacity-100">
            Client login
          </a>
        </div>
      </div>
    </footer>
  );
}
