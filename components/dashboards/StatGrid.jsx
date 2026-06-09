const toneClasses = {
  brand: "border-teal-100 bg-gradient-to-br from-white to-teal-50/70 text-brand",
  accent: "border-orange-100 bg-gradient-to-br from-white to-orange-50/80 text-accent",
  ink: "border-slate-200 bg-white text-ink",
  warning: "border-amber-100 bg-gradient-to-br from-white to-amber-50 text-amber-700",
  danger: "border-red-100 bg-gradient-to-br from-white to-red-50 text-red-700"
};

export function StatGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-[26px] border p-5 shadow-sm ${toneClasses[item.tone || "ink"]}`}
        >
          <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-black text-ink">{item.value}</p>
          {item.helper ? <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.helper}</p> : null}
        </div>
      ))}
    </div>
  );
}
