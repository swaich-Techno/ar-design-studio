import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { costLayers, pricing } from "@/lib/redesign/site";
import { cn } from "@/lib/redesign/utils";

export function PricingCards() {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Pricing</p>
        <h2 className="headline mt-4 max-w-[14ch] text-[clamp(2.4rem,6vw,5rem)]">
          Start with a pilot. Not a catalogue of extras.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Starting from — 3D modelling, extra SKUs, and custom scenes change the quote.
        </p>
        <div className={`mt-12 grid gap-5 ${pricing.length > 1 ? "lg:grid-cols-2" : "max-w-xl"}`}>
          {pricing.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                "rounded-[32px] border p-8 md:p-10",
                plan.recommended
                  ? "border-[var(--gold)]/50 bg-[linear-gradient(180deg,rgba(212,179,106,0.12),transparent)]"
                  : "border-white/10 bg-[#101114]",
              )}
            >
              <p className="kicker">{plan.kicker}</p>
              <h3 className="mt-4 font-display text-4xl">{plan.name}</h3>
              <p className="mt-4 text-sm text-muted">Starting from</p>
              <p className="font-display text-5xl">{plan.from}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted">Included</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--fg)]/80">
                {plan.include.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted">Not included</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {plan.exclude.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <dl className="mt-6 space-y-2 text-sm text-[var(--fg)]/75">
                <div>
                  <dt className="text-muted">3D modelling</dt>
                  <dd>{plan.modelling}</dd>
                </div>
                <div>
                  <dt className="text-muted">Setup time</dt>
                  <dd>{plan.setup}</dd>
                </div>
                <div>
                  <dt className="text-muted">Hosting</dt>
                  <dd>{plan.hosting}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-muted">{plan.after}</p>
              <Button asChild className="mt-8" variant={plan.recommended ? "gold" : "primary"}>
                <Link href="/ar/demo#request">Request this pilot</Link>
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {costLayers.map((layer) => (
            <div key={layer.title} className="rounded-3xl border border-white/8 p-6">
              <p className="font-display text-xl">{layer.title}</p>
              <p className="mt-2 text-sm text-muted">{layer.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
