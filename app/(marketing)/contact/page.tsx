import { DemoRequestForm } from "@/components/redesign/forms/demo-request-form";
import { site, waLink } from "@/lib/redesign/site";

import { arPageMeta } from "@/lib/redesign/seo";

export const metadata = arPageMeta({
  title: "Contact | B Socio AR",
  description: "Request a Food AR demo. WhatsApp +91 70094 64475. Email connect@bsocio.in.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="headline mt-4 text-[clamp(3rem,7vw,6rem)]">Request a demo.</h1>
          <p className="mt-5 text-muted">
            Tell us the food business and one signature dish. We’ll say whether a pilot makes sense.
          </p>
          <div className="mt-10 space-y-2 text-sm">
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <a href={waLink(site.whatsapp.main, "Hi B Socio — I want to start a project.")}>{site.phoneDisplay}</a>
            </p>
            <p>{site.location}</p>
          </div>
          <p className="mt-8 max-w-md text-sm text-muted">
            Requests are saved for review. You can also message WhatsApp directly if you would rather talk first.
          </p>
        </div>
        <DemoRequestForm context="ar" />
      </div>
    </section>
  );
}
