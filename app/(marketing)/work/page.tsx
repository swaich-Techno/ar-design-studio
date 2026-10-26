import Link from "next/link";
import { conceptWork } from "@/lib/redesign/site";

export const metadata = {
  title: "Work | B Socio",
  description: "Selected concept experiences from B Socio AR — food menus and the AR commerce engine.",
  alternates: { canonical: "https://ar.bsocio.in/work" },
};

export default function WorkPage() {
  return (
    <section className="px-5 pb-28 pt-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Work</p>
        <h1 className="headline mt-4 max-w-[12ch] text-[clamp(3rem,8vw,7rem)]">Experiences, not decks.</h1>
        <p className="mt-6 max-w-xl text-muted">
          Until live client projects are published here, these are labelled Concept Experiences. No invented results.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
            {conceptWork.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="min-h-[380px] overflow-hidden rounded-[32px] border border-white/10 p-8"
                style={{
                  background:
                    item.vertical === "Food"
                      ? "radial-gradient(circle at 80% 10%, rgba(196,69,54,0.3), #16090c 55%)"
                      : "radial-gradient(circle at 50% 0%, rgba(139,124,255,0.28), #101114 55%)",
                }}
              >
                <span className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em]">
                  {item.label}
                </span>
                <h2 className="mt-24 font-display text-4xl">{item.title}</h2>
                <p className="mt-3 text-sm text-muted">{item.vertical}</p>
              </Link>
            ))}
          </div>
        </div>
    </section>
  );
}
