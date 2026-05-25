import { ArrowRight, BadgeIndianRupee, Box, FileSpreadsheet, LineChart, Megaphone, Palette, QrCode, ScanLine, Smartphone, Store, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const how = [
  "Create business account",
  "Add products and prices",
  "Upload product images",
  "Add 3D model URL",
  "Generate QR codes",
  "Print/share QR codes",
  "Customers scan QR",
  "Customers view product/menu",
  "Customers order on WhatsApp",
  "Business tracks analytics"
];

const industries = ["Sweet shops", "Restaurants", "Cafes", "Furniture showrooms", "Jewellery stores", "Real estate", "Boutiques", "Automobile dealers", "Gift shops", "Event planners", "Local shops"];

const pricing = [
  ["Starter", "Rs. 9,999 setup + Rs. 1,999/month", ["10 products", "Image catalogue only", "Product QR and catalogue QR", "WhatsApp lead tracking", "No included AR/3D models"]],
  ["Growth", "Rs. 19,999 setup + Rs. 5,999/month", ["25 products", "Up to 5 AR/3D products", "Table QR and campaign QR", "Lead export to CSV", "Monthly scan and lead report"]],
  ["Premium", "Rs. 49,999 setup + Rs. 12,999/month", ["50 products", "Up to 15 AR/3D products", "Advanced analytics", "Staff accounts", "Custom branded catalogue"]],
  ["Enterprise", "Custom pricing", ["100+ products", "Custom AR campaigns", "GA/Meta Pixel support", "Priority onboarding", "Extra storage and traffic"]]
];

const valueFeatures = [
  ["WhatsApp lead tracking", "Clients understand leads more than QR scans."],
  ["Lead export to Excel/CSV", "Useful for sales teams and follow-up calling."],
  ["Google Analytics / Meta Pixel support", "Helps campaign clients retarget visitors."],
  ["Custom branded catalogue page", "Makes the product feel more premium than basic QR tools."],
  ["Template-based campaign pages", "Creates easy upsells for festivals, launches, and events."],
  ["AR demo link before purchase", "Helps clients understand the value before they commit."],
  ["Boutique stitched-preview workflow", "Fabric photos can show stitched mockups, while rotatable AR needs a real 3D outfit model."],
  ["Monthly scan and lead report", "Justifies the recurring fee with visible outcomes."],
  ["Annual discount", "Improves cash flow with 2 months free on yearly plans."],
  ["Onboarding support", "Justifies the setup fee and reduces client confusion."]
];

const proofCards = [
  ["Leads over vanity scans", LineChart, "Track WhatsApp clicks, calls, shares, AR views, and catalogue scans in one place."],
  ["Sales-ready exports", FileSpreadsheet, "Download lead activity as CSV so client teams can follow up without asking you for reports."],
  ["Premium client branding", Palette, "Catalogue pages can carry client logo, cover image, colors, offers, and campaign templates."],
  ["Campaign upsells", Megaphone, "Festival offers, launches, pop-ups, and seasonal QR pages become billable add-ons."]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
            <ScanLine size={22} />
          </div>
          <div>
            <p className="text-lg font-black">AR Design Studio</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Scan. View. Experience. Order.</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button href="/pricing" variant="ghost">Pricing</Button>
          <Button href="/business/login" variant="light">Client login</Button>
          <Button href="/business/register" variant="accent">Start account</Button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-brand">QR menus, 3D previews, AR view, WhatsApp leads</div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-ink md:text-7xl">Turn Your Products Into Interactive 3D & AR Experiences</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Let your customers scan a QR code, view your products in 3D or AR, and order instantly through WhatsApp.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="accent">Get Free Demo <ArrowRight size={18} /></Button>
            <Button href="/pricing" variant="light">View Pricing</Button>
            <Button href="/business/register">Start Your Business Account</Button>
            <Button href="/install" variant="ghost">Install Mobile App</Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-orange-200 blur-3xl" />
          <div className="absolute -right-8 bottom-12 h-44 w-44 rounded-full bg-teal-200 blur-3xl" />
          <Card className="relative overflow-hidden p-0">
            <div className="bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="font-black">Live QR product page</p>
                <QrCode />
              </div>
            </div>
            <div className="p-5">
              <div className="aspect-[4/3] rounded-[24px] bg-gradient-to-br from-slate-950 via-teal-900 to-orange-500 p-5 text-white">
                <div className="flex h-full flex-col justify-between">
                  <Box size={44} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-100">3D product preview</p>
                    <h2 className="mt-2 text-3xl font-black">Model viewer ready</h2>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {["AR views", "WhatsApp", "Scans"].map((label) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xl font-black">Live</p>
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold text-brand">How It Works</p>
            <h2 className="text-3xl font-black md:text-4xl">From product to QR order flow</h2>
          </div>
          <Smartphone className="hidden text-brand md:block" size={38} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {how.map((step, index) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span>
              <p className="mt-4 font-bold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 lg:grid-cols-4">
        {[
          ["Product QR", QrCode, "Direct product AR page with WhatsApp order."],
          ["Catalogue QR", Store, "Full menu or product catalogue for the business."],
          ["Table QR", ScanLine, "Restaurant table menu with table number in order messages."],
          ["Campaign QR", WandSparkles, "Offer pages connected to selected products."]
        ].map(([title, Icon, text]) => (
          <Card key={title}>
            <Icon className="text-brand" size={32} />
            <h3 className="mt-5 text-xl font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7 max-w-3xl">
          <p className="font-bold text-brand">Value Stack</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Features that make the pricing stronger</h2>
          <p className="mt-3 leading-7 text-slate-600">
            The platform is positioned as a lead and client-management system, not just a QR generator. That gives businesses a clearer reason to pay monthly.
          </p>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[0.9fr_1.1fr] bg-ink px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white">
            <span>Feature</span>
            <span>Why it helps</span>
          </div>
          <div className="divide-y divide-slate-100">
            {valueFeatures.map(([feature, why]) => (
              <div key={feature} className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
                <p className="font-black text-ink">{feature}</p>
                <p className="font-semibold leading-6 text-slate-600">{why}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {proofCards.map(([title, Icon, text]) => (
            <Card key={title}>
              <Icon className="text-brand" size={30} />
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="font-bold text-brand">Industries</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Built for high-conversion local commerce</h2>
            <p className="mt-4 leading-7 text-slate-600">Menus, products, rooms, vehicles, gifts, jewellery, and showpieces can become scan-to-order experiences.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {industries.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 lg:grid-cols-4">
        {pricing.map(([name, price, items]) => (
          <Card key={name}>
            <div className="flex items-center gap-3">
              <BadgeIndianRupee className="text-accent" />
              <h3 className="text-2xl font-black">{name}</h3>
            </div>
            <p className="mt-3 text-xl font-black text-brand">{price}</p>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              {items.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <p className="rounded-[24px] border border-orange-200 bg-orange-50 p-5 text-sm font-bold leading-7 text-orange-800">
            Cloud storage and AR model hosting are included within fair usage limits. Heavy 3D models, high traffic, or extra storage may require an add-on.
          </p>
          <p className="rounded-[24px] border border-teal-200 bg-teal-50 p-5 text-sm font-bold leading-7 text-teal-900">
            Annual billing can include 2 months free. Setup includes onboarding support, catalogue setup guidance, and QR launch assistance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <Card className="grid gap-6 bg-ink text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-bold text-teal-200">Contact CTA</p>
            <h2 className="mt-2 text-3xl font-black">Launch QR-powered AR ordering for your clients.</h2>
            <p className="mt-3 text-slate-300">Create the business account, add real products and model URLs, then print QR codes that open public browser pages without login.</p>
          </div>
          <Button href="/contact" variant="light">Request setup</Button>
        </Card>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AR Design Studio. Scan. View. Experience. Order.</p>
        <div className="flex gap-4">
          <a href="/super-admin/login" className="font-bold">Super Admin</a>
          <a href="/staff/login" className="font-bold">Staff</a>
          <a href="/install" className="font-bold">Install app</a>
        </div>
      </footer>
    </main>
  );
}
