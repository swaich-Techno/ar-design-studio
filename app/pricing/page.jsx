import { BadgeIndianRupee, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    name: "Starter",
    label: "Best for first QR catalogue",
    price: "Rs. 9,999 setup + Rs. 1,999/month",
    tone: "border-slate-200",
    items: [
      "10 products",
      "Image catalogue only",
      "Product QR and catalogue QR",
      "WhatsApp lead tracking",
      "Monthly basic scan report",
      "AR/3D available as paid add-on",
      "1 MB max image upload"
    ]
  },
  {
    name: "Growth",
    label: "Recommended for most clients",
    price: "Rs. 19,999 setup + Rs. 5,999/month",
    tone: "border-teal-200 ring-4 ring-teal-100",
    items: [
      "25 products",
      "Up to 5 AR/3D products included",
      "Table QR and campaign QR included",
      "Restaurant cart ordering",
      "WhatsApp leads and analytics",
      "Lead export to Excel/CSV",
      "Template-based campaign pages",
      "2 MB max image upload"
    ]
  },
  {
    name: "Premium",
    label: "Best for teams and showrooms",
    price: "Rs. 49,999 setup + Rs. 12,999/month",
    tone: "border-orange-200",
    items: [
      "50 products",
      "Up to 15 AR/3D products included",
      "Advanced analytics",
      "Monthly report export",
      "AR compatibility checker",
      "Staff accounts",
      "Custom branded catalogue page",
      "Google Analytics / Meta Pixel support",
      "5 MB max image upload"
    ]
  },
  {
    name: "Enterprise",
    label: "For custom AR commerce",
    price: "Custom pricing",
    tone: "border-slate-200",
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
  ["Lead export to Excel/CSV", "Helps sales teams follow up faster."],
  ["GA / Meta Pixel support", "Supports retargeting for paid campaigns."],
  ["AR demo link before purchase", "Makes AR value easier to sell before onboarding."],
  ["Annual discount", "Offer 2 months free on yearly plans to improve cash flow."],
  ["Onboarding support", "Supports a higher setup fee and smoother client launch."]
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-10 text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button href="/" variant="ghost">Back</Button>
          <Button href="/contact?source=pricing-top" variant="accent">Request Demo</Button>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-brand">
              <Sparkles size={16} /> Pricing built for AR startup margins
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Simple plans with clear upgrade paths.</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
              Keep entry pricing easy for local businesses, then upsell AR models, storage, campaigns, staff seats, and annual billing.
            </p>
          </div>
          <Card className="bg-ink text-white">
            <Crown className="text-orange-300" size={34} />
            <h2 className="mt-4 text-2xl font-black">Recommended selling motion</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
              Start with a demo QR product page, close Growth for active businesses, and add AR model optimization as the high-value service.
            </p>
          </Card>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.tone}>
              <div className="flex items-center justify-between gap-3">
                <BadgeIndianRupee className="text-accent" />
                {plan.name === "Growth" ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">Best value</span> : null}
              </div>
              <h2 className="mt-5 text-2xl font-black">{plan.name}</h2>
              <p className="mt-1 text-sm font-black text-brand">{plan.label}</p>
              <p className="mt-4 text-xl font-black text-ink">{plan.price}</p>
              <ul className="mt-5 grid gap-3 text-sm font-bold text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand" /> {item}
                  </li>
                ))}
              </ul>
              <Button href={`/contact?source=pricing-${plan.name.toLowerCase()}`} variant={plan.name === "Growth" ? "accent" : "light"} className="mt-6 w-full">
                Request {plan.name}
              </Button>
            </Card>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-2xl font-black">Add-ons that protect cost</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Keep base plans clean and charge separately for heavy Cloudinary usage, 3D work, and campaign extras.</p>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-slate-600">
              {addOns.map((item) => <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">{item}</li>)}
            </ul>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Why clients pay monthly</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {valueAdds.map(([feature, why]) => (
                <div key={feature} className="grid gap-2 py-4 sm:grid-cols-[0.85fr_1.15fr]">
                  <p className="font-black text-ink">{feature}</p>
                  <p className="text-sm font-semibold leading-6 text-slate-600">{why}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mt-8 rounded-[28px] border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-2xl font-black text-orange-900">Annual offer</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-orange-800">
            Offer 2 months free on annual billing. It improves startup cash flow, reduces monthly follow-up work, and gives clients a simple reason to commit.
          </p>
        </section>
      </div>
    </main>
  );
}
