import { compatibility } from "@/lib/redesign/site";

export function Compatibility() {
  return (
    <section className="px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="kicker">Compatibility</p>
        <h2 className="headline mt-4 max-w-[16ch] text-[clamp(2rem,4vw,3.6rem)]">
          We name them honestly.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {compatibility.map((row) => (
            <article key={row.name} className="rounded-[28px] border border-white/10 bg-[#101114]/80 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{row.support}</p>
              <h3 className="mt-3 font-display text-2xl">{row.name}</h3>
              <p className="mt-3 text-sm text-[var(--fg)]/75">{row.note}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                {row.status === "yes" ? "Supported" : "Pilot / integration dependent"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
