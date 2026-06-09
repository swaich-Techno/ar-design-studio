export function Card({ children, className = "" }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-6 shadow-soft ${className}`}>{children}</div>;
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
