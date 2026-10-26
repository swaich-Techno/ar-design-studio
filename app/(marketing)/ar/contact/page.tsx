import { DemoRequestForm } from "@/components/redesign/forms/demo-request-form";
import { site, waLink } from "@/lib/redesign/site";

import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "Request Demo | B Socio AR",
  description: "Request a Food AR demo. Browser-based interactive menus. No customer app.",
  path: "/ar/contact",
});

export default function ArContactPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
        <div>
          <p className="kicker">Request Demo</p>
          <h1 className="headline mt-4 text-[clamp(3rem,7vw,5.6rem)]">Let’s put a product in the room.</h1>
          <p className="mt-5 text-muted">Food AR. We’ll start with a pilot, not a 40-page proposal.</p>
          <div className="mt-10 space-y-2 text-sm">
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <a href={waLink(site.whatsapp.ar, "Hi — I want a B Socio AR demo.")}>{site.phoneDisplay}</a>
            </p>
            <p>{site.location}</p>
          </div>
        </div>
        <DemoRequestForm context="ar" />
      </div>
    </section>
  );
}
