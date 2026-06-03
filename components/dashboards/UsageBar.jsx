export function UsageBar({ label, used = 0, limit = 0, unit = "", zeroLabel = "0" }) {
  const percent = limit ? Math.min(100, Math.round((Number(used || 0) / Number(limit)) * 100)) : 0;
  const isWarning = percent >= 80;
  const displayValue = Number(limit || 0) > 0 ? `${used}${unit} / ${limit}${unit}` : zeroLabel;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <span>{label}</span>
        <span className={isWarning ? "text-orange-600" : "text-slate-500"}>
          {displayValue}
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={isWarning ? "h-full rounded-full bg-orange-500" : "h-full rounded-full bg-brand"} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
