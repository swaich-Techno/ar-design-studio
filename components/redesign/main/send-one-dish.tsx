import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { site, waLink } from "@/lib/redesign/site";

export function SendOneDish() {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px] rounded-[36px] border border-white/10 bg-[#16090c] px-8 py-16">
        <p className="kicker">Sample</p>
        <h2 className="headline mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,4.4rem)]">SEND US ONE DISH</h2>
        <p className="mt-5 max-w-xl text-[var(--fg)]/75">
          Request a sample of how one signature dish can look as a menu item, 3D page, and AR placement where the phone
          supports it. This is not a free 3D model for every SKU.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href="/contact">Request a sample</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={waLink(site.whatsapp.ar, "Hi — I want to send one dish for a B Socio AR sample.")}>Talk on WhatsApp</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
