import { ArHeroLoop } from "@/components/redesign/ar/hero-loop";
import { FoodDemoStudio } from "@/components/redesign/ar/food-demo";
import { ProductFlow } from "@/components/redesign/ar/product-flow";
import { DemoAnalytics } from "@/components/redesign/ar/demo-analytics";
import { PricingCards } from "@/components/redesign/ar/pricing-cards";
import { RealQr } from "@/components/redesign/ar/real-qr";
import { DemoRequestForm } from "@/components/redesign/forms/demo-request-form";
import { copy, site, waLink } from "@/lib/redesign/site";
import { arPageMeta } from "@/lib/redesign/seo";
import { Button } from "@/components/redesign/ui/button";

export const metadata = arPageMeta({
  title: "Food AR Experiences | B Socio AR",
  description:
    "Let customers eat with their eyes first. Hero-product AR for chef specials, desserts, drinks, hotels, weddings, cafés and gift boxes.",
  path: "/ar/food",
});

const uses = [
  "Chef specials",
  "Desserts",
  "Drinks",
  "Hotel dining",
  "Wedding / catering",
  "Café signatures",
  "Gift boxes",
];

export default function FoodArPage() {
  return (
    <div className="food-page">
      <section className="relative overflow-hidden bg-[#16090c]">
        <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 content-center gap-8 px-5 pb-16 pt-28 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-center md:px-10 md:pt-24 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,40%)]">
          <div className="relative z-20 min-w-0">
            <h1 className="headline max-w-[12ch] text-[clamp(2.6rem,7vw,6.2rem)] text-[#f3efe6]">
              {copy.ar.foodTitle[0]}
              <span className="block font-serif italic tracking-normal">{copy.ar.foodTitle[1]}</span>
            </h1>
            <p className="kicker mt-6">Food · Hero-product AR</p>
            <p className="mt-5 max-w-lg text-[var(--fg)]/75">{copy.ar.foodSupport}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <a href="#food-demo">SEE ON MY TABLE</a>
              </Button>
              <Button asChild variant="ghost">
                <a href="#food-demo">View in 3D</a>
              </Button>
              <Button asChild variant="ghost">
                <a href={waLink(site.whatsapp.ar, "Food AR enquiry")}>Enquire</a>
              </Button>
            </div>
          </div>
          <div className="relative z-10 w-full min-w-0">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[520px] md:mx-0 md:aspect-auto md:h-[min(58vh,500px)] md:max-w-none">
              <ArHeroLoop kind="food" priority />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted">
              AR dining preview · concept / pilot
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#16090c] px-5 py-16 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="kicker">Where it works</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {uses.map((item) => (
              <span key={item} className="rounded-full border border-white/12 px-4 py-2 text-sm">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-12">
            <ProductFlow />
          </div>
          <p className="mt-6 text-sm text-muted">
            Calories and allergen data appear only when a restaurant supplies them. This demo does not invent nutrition
            facts.
          </p>
        </div>
      </section>
      <section id="food-demo" className="scroll-mt-28 bg-[#12080a] px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FoodDemoStudio />
        </div>
      </section>
      <section className="bg-[#12080a] px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
          <div>
            <p className="kicker">QR / share</p>
            <h2 className="headline mt-4 text-[clamp(2rem,4vw,3.2rem)]">A table tent. One scan.</h2>
            <p className="mt-4 text-muted">Customers open the dish in the browser. No app.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 p-6">
            <RealQr path="/ar/food" label="Scan this with your phone to open the food demo." />
          </div>
        </div>
      </section>
      <div className="bg-[#12080a]">
        <DemoAnalytics />
        <PricingCards />
      </div>
      <section className="bg-[#12080a] px-5 pb-28 md:px-10">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
          <div>
            <p className="kicker">Request food demo</p>
            <h2 className="headline mt-4 text-[clamp(2.2rem,5vw,4rem)]">Start with one signature dish.</h2>
          </div>
          <DemoRequestForm context="ar" />
        </div>
      </section>
    </div>
  );
}
