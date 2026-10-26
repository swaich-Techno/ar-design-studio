import Link from "next/link";
import { foodVerticals, site, waLink } from "@/lib/redesign/site";
import { arPageMeta } from "@/lib/redesign/seo";
import { Button } from "@/components/redesign/ui/button";

export const metadata = arPageMeta({
  title: "Food Businesses | Interactive Menus | B Socio AR",
  description:
    "Interactive QR, 3D and AR menus for restaurants, cafés, bakeries, sweet shops, hotels, catering, cloud kitchens and dessert brands.",
  path: "/ar/food-businesses",
});

export default function FoodBusinessesPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Food businesses</p>
        <h1 className="headline mt-4 max-w-[16ch] text-[clamp(2.8rem,7vw,5.6rem)]">BUILT FOR THE WAY YOU SELL FOOD</h1>
        <p className="mt-5 max-w-xl text-muted">
          Same engine: QR, catalogue, optional 3D, AR where the phone supports it, WhatsApp enquiry. We model a few hero
          dishes. We do not pretend every SKU is photogrammetry.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {foodVerticals.map((item) => (
            <article key={item.id} id={item.id} className="rounded-[28px] border border-white/10 bg-[#101114] p-6">
              <h2 className="font-display text-3xl">{item.title}</h2>
              <p className="mt-3 text-sm text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href="/ar/demo">Experience the menu</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">Request a demo</Link>
          </Button>
          <a className="inline-flex min-h-11 items-center text-sm text-muted" href={waLink(site.whatsapp.ar, "Hi — food business demo.")}>
            Talk on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
