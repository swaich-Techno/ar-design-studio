import { PricingCards } from "@/components/redesign/ar/pricing-cards";
import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "Food AR Pilot Pricing | B Socio AR",
  description:
    "Food AR Pilot starting ₹14,999. Up to 3 hero dishes, QR table tents, 3D pages, See on My Table, and WhatsApp enquiry.",
  path: "/ar/pricing",
});

export default function ArPricingPage() {
  return (
    <div className="pt-16">
      <PricingCards />
    </div>
  );
}
