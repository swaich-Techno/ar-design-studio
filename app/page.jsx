import { MarketingShell } from "./marketing-shell";
import { Compatibility } from "@/components/redesign/main/compatibility";
import { MainHero } from "@/components/redesign/main/hero";
import { Process } from "@/components/redesign/main/process";
import { SendOneDish } from "@/components/redesign/main/send-one-dish";
import { SellVerticals } from "@/components/redesign/main/sell-verticals";
import { StaticToInteractive } from "@/components/redesign/main/static-to-interactive";
import { ValueSplit } from "@/components/redesign/main/value-split";
import { arPageMeta, homeJsonLd } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "B Socio AR | Interactive QR, 3D & AR Menus for Food Businesses",
  description:
    "Turn restaurant, café, bakery and food menus into interactive digital experiences with QR access, premium product presentation, 3D dishes, AR and direct enquiry.",
  path: "/",
});

export default function LandingPage() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }} />
      <MainHero />
      <StaticToInteractive />
      <SellVerticals />
      <ValueSplit />
      <Process />
      <SendOneDish />
      <Compatibility />
    </MarketingShell>
  );
}
