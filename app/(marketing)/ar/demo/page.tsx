import { DemoRestaurant } from "@/components/redesign/ar/demo-restaurant";
import { DemoRequestForm } from "@/components/redesign/forms/demo-request-form";
import { site, waLink } from "@/lib/redesign/site";
import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "B Socio Demo Restaurant | Interactive Menu | B Socio AR",
  description:
    "A labelled DEMO restaurant menu: starters, mains, desserts and drinks. Three hero dishes with real photos, 3D and AR where supported.",
  path: "/ar/demo",
});

export default function DemoPage() {
  return (
    <>
      <DemoRestaurant />
      <section id="request" className="mx-auto grid max-w-[1100px] gap-12 scroll-mt-28 px-5 pb-28 md:grid-cols-2 md:px-10">
        <div>
          <p className="kicker">Request Demo</p>
          <h2 className="headline mt-4 text-[clamp(2.2rem,5vw,4rem)]">Request a food menu sample</h2>
          <p className="mt-4 text-muted">Start with a few hero dishes. 3D modelling is quoted — not unlimited.</p>
          <a className="mt-6 inline-flex min-h-11 items-center text-sm text-muted" href={waLink(site.whatsapp.ar, "Hi — I want a Food AR demo.")}>
            Talk on WhatsApp · {site.phoneDisplay}
          </a>
        </div>
        <DemoRequestForm context="ar" />
      </section>
    </>
  );
}
