const CUSTOMERS = [
  "The dish, not a blurry printout",
  "3D when a model exists — photo if it does not",
  "Place on table on supported phones",
  "WhatsApp with the dish already filled in",
];

const OWNERS = [
  "QR for the menu and, where you use them, tables",
  "A live catalogue you can hide, mark sold out, or feature",
  "Basic scan, view, 3D, AR, and enquiry events",
  "No customer app to install",
];

export function ValueSplit() {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
        <article className="rounded-[32px] border border-white/10 bg-[#101114] p-8">
          <p className="kicker">Guests</p>
          <h2 className="headline mt-4 text-[clamp(1.8rem,4vw,3rem)]">What customers notice</h2>
          <ul className="mt-6 space-y-3 text-[var(--fg)]/80">
            {CUSTOMERS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-[32px] border border-[var(--burgundy-2)] bg-[#16090c] p-8">
          <p className="kicker">Operators</p>
          <h2 className="headline mt-4 text-[clamp(1.8rem,4vw,3rem)]">What owners get</h2>
          <ul className="mt-6 space-y-3 text-[var(--cream)]">
            {OWNERS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
