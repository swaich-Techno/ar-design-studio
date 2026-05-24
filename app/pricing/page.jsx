import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    name: "Starter",
    price: "Rs. 4,999 setup + Rs. 999/month",
    items: [
      "10 products",
      "Image catalogue only",
      "Product QR and catalogue QR",
      "No included AR/3D models",
      "AR/3D available as paid add-on",
      "1 MB max image upload"
    ]
  },
  {
    name: "Growth",
    price: "Rs. 9,999 setup + Rs. 2,999/month",
    items: [
      "25 products",
      "Up to 5 AR/3D products included",
      "Table QR and campaign QR included",
      "WhatsApp leads and analytics",
      "2 MB max image upload"
    ]
  },
  {
    name: "Premium",
    price: "Rs. 24,999 setup + Rs. 5,999/month",
    items: [
      "50 products",
      "Up to 15 AR/3D products included",
      "Advanced analytics",
      "Staff accounts",
      "5 MB max image upload"
    ]
  }
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
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
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
        <p className="mt-8 rounded-[24px] border border-orange-200 bg-orange-50 p-5 text-sm font-bold leading-7 text-orange-800">
          Cloud storage and AR model hosting are included within fair usage limits. Heavy 3D models, high traffic, or extra storage may require an add-on.
        </p>
      </div>
    </main>
  );
}
