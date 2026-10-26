import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { site, waLink } from "@/lib/redesign/site";

export function SampleProduct() {
  return (
    <section className="px-5 pb-24 md:px-10">
      <div className="mx-auto max-w-[1400px] rounded-[36px] border border-white/10 px-8 py-16">
        <p className="kicker">Send us one product</p>
        <h2 className="headline mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,4.4rem)]">
          One signature dish. Start there.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Send a hero dish we can digitise into a Food AR sample. This is a quote path — not a
          promise of free custom modelling.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href="/ar/demo#request">Request a Sample Experience</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={waLink(site.whatsapp.ar, "I want to send one hero dish for a Food AR sample.")}>
              Talk on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
