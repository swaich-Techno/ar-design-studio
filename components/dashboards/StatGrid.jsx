export function StatGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">{item.label}</p>
          <p className="mt-2 text-3xl font-black text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
