import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { site } from "@/lib/redesign/site";

export const metadata = {
  title: "About | B Socio",
  description:
    "B Socio is a creative technology studio in Punjab. Creative technology for businesses that want to be experienced, not just seen.",
  alternates: { canonical: "https://ar.bsocio.in/about" },
};

export default function AboutPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="kicker">About</p>
        <h1 className="headline mt-4 text-[clamp(3rem,7vw,6.4rem)]">
          Built for businesses that need more than posts.
        </h1>
        <div className="mt-10 space-y-6 text-lg text-[var(--fg)]/80">
          <p>{site.tagline}</p>
          <p>
            B Socio is a creative technology company. We still make campaigns, content and websites. We also build the
            thing after the picture: 3D objects, AR product pages, and WhatsApp conversion.
          </p>
          <p>
            B Socio AR is the product arm. This phase focuses on Food AR — interactive menus and See on My Table.
            Other industries can still be supported. They do not lead the story.
          </p>
          <p>
            We are based in {site.location}. The work is commercial. The craft is visual.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">Start a Project</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/ar">Explore AR</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
