import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    name: "Starter",
    price: "Rs. 9,999 setup + Rs. 1,999/month",
    items: [
      "10 products",
      "Image catalogue only",
      "Product QR and catalogue QR",
      "WhatsApp lead tracking",
      "Monthly basic scan report",
      "No included AR/3D models",
      "AR/3D available as paid add-on",
      "1 MB max image upload"
    ]
  },
  {
    name: "Growth",
    price: "Rs. 19,999 setup + Rs. 5,999/month",
    items: [
      "25 products",
      "Up to 5 AR/3D products included",
      "Table QR and campaign QR included",
      "WhatsApp leads and analytics",
      "Lead export to Excel/CSV",
      "Template-based campaign pages",
      "2 MB max image upload"
    ]
  },
  {
    name: "Premium",
    price: "Rs. 49,999 setup + Rs. 12,999/month",
    items: [
      "50 products",
      "Up to 15 AR/3D products included",
      "Advanced analytics",
      "Staff accounts",
      "Custom branded catalogue page",
      "Google Analytics / Meta Pixel support",
      "5 MB max image upload"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    items: [
      "100+ products",
      "Custom AR/3D showcase pages",
      "Dedicated onboarding support",
      "Advanced reports and exports",
      "Extra storage, bandwidth, and custom domain options"
    ]
  }
];

const addOns = [
  "Extra 10 products: Rs. 1,499/month",
  "Extra 5 AR products: Rs. 4,999/month",
  "Extra storage: Rs. 1,499/month per GB",
  "3D model optimization: Rs. 2,500 to Rs. 10,000/model",
  "Custom AR campaign page: Rs. 9,999 one-time",
  "Boutique stitched preview setup: custom quote"
];

const valueAdds = [
  ["WhatsApp lead tracking", "Makes results easy for clients to understand."],
  ["Lead export to Excel/CSV", "Helps client sales teams follow up faster."],
  ["GA / Meta Pixel support", "Supports retargeting for paid campaigns."],
  ["AR demo link before purchase", "Makes AR value easier to sell before onboarding."],
  ["Boutique stitched-preview workflow", "Unstitched cloth photos can be paired with stitched mockup images; rotation requires a real 3D model."],
  ["Annual discount", "Offer 2 months free on yearly plans to improve cash flow."],
  ["Onboarding support", "Supports a higher setup fee and smoother client launch."]
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Button href="/" variant="ghost">Back</Button>
        <h1 className="mt-8 text-4xl font-black md:text-6xl">Simple pricing for AR commerce.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Choose the setup size that matches your catalogue, QR volume, storage, and AR model needs.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <h2 className="text-2xl font-black">{plan.name}</h2>
              <p className="mt-3 text-xl font-black text-brand">{plan.price}</p>
              <ul className="mt-4 grid gap-3 text-sm font-bold text-slate-600">
                {plan.items.map((item) => <li key={item}>- {item}</li>)}
              </ul>
              <Button href="/contact" variant="accent" className="mt-6 w-full">Request this plan</Button>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-2xl font-black">Add-ons</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Keep base plans fair and charge separately for heavy Cloudinary usage, 3D work, and campaign extras.</p>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-slate-600">
              {addOns.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Why clients pay monthly</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {valueAdds.map(([feature, why]) => (
                <div key={feature} className="grid gap-2 py-3 sm:grid-cols-[0.85fr_1.15fr]">
                  <p className="font-black text-ink">{feature}</p>
                  <p className="text-sm font-semibold leading-6 text-slate-600">{why}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <p className="mt-8 rounded-[24px] border border-orange-200 bg-orange-50 p-5 text-sm font-bold leading-7 text-orange-800">
          Cloud storage and AR model hosting are included within fair usage limits. Heavy 3D models, high traffic, or extra storage may require an add-on. Annual billing can include 2 months free.
        </p>
      </div>
    </main>
  );
}
