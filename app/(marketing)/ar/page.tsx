import Link from "next/link";
import { ArHero } from "@/components/redesign/ar/hero";
import { QrMoment } from "@/components/redesign/ar/qr-moment";
import { DemoAnalytics } from "@/components/redesign/ar/demo-analytics";
import { PricingCards } from "@/components/redesign/ar/pricing-cards";
import { ProductFlow } from "@/components/redesign/ar/product-flow";
import { Button } from "@/components/redesign/ui/button";
import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "B Socio AR | Interactive QR, 3D & AR Menus for Food Businesses",
  description:
    "Turn restaurant, café, bakery and food menus into interactive digital experiences with QR access, premium product presentation, 3D dishes, AR and direct enquiry.",
  path: "/ar",
});

export default function ArHomePage() {
  return (
    <>
      <ArHero />
      <section className="px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="kicker">How a product moves</p>
          <h2 className="headline mt-4 mb-10 text-[clamp(2.2rem,5vw,4.4rem)]">From picture to enquiry.</h2>
          <ProductFlow />
        </div>
      </section>
      <QrMoment />
      <DemoAnalytics />
      <PricingCards />
      <section className="px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[1400px] rounded-[36px] border border-white/10 px-8 py-16">
          <h2 className="headline text-[clamp(2.4rem,6vw,5rem)]">Products shouldn’t stop at pictures.</h2>
          <p className="mt-5 max-w-xl text-muted">Food AR only on this public story. Browser-based. No customer app.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/ar/demo">EXPERIENCE THE MENU</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">REQUEST A DEMO</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
