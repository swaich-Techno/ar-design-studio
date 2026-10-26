import { ProductFlow } from "@/components/redesign/ar/product-flow";
import { QrMoment } from "@/components/redesign/ar/qr-moment";

import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "How AR Commerce Works | B Socio AR",
  description:
    "Send a product. We digitise it. Customers scan, view in 3D, place in AR where supported, then enquire on WhatsApp.",
  path: "/ar/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">How it works</p>
        <h1 className="headline mt-4 max-w-[14ch] text-[clamp(3rem,7vw,6rem)]">Scan. Experience. Enquire.</h1>
        <p className="mt-6 max-w-xl text-muted">
          Customers open a browser page. No app. A product can be rotated, inspected, and — where the device supports it
          — placed in the room. Enquiry goes to WhatsApp with the product attached.
        </p>
        <div className="mt-16">
          <ProductFlow items={["SEND", "BUILD", "DIGITISE", "PLACE", "GO LIVE", "MEASURE"]} />
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { t: "Build", d: "Photos, prices, and 3D files go into a catalogue." },
            { t: "Publish", d: "QR pages live on counters, packaging, tables, and ads." },
            { t: "Track", d: "Scans, views, AR launches, and enquiries — labelled clearly when demo." },
          ].map((item) => (
            <article key={item.t} className="rounded-3xl border border-white/10 p-6">
              <h2 className="font-display text-2xl">{item.t}</h2>
              <p className="mt-2 text-sm text-muted">{item.d}</p>
            </article>
          ))}
        </div>
      </div>
      <QrMoment />
    </section>
  );
}
