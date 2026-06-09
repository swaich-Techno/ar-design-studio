import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

function checkClass(ok) {
  return ok ? "text-teal-700" : "text-orange-700";
}

export function ARCompatibilityChecklist({ product }) {
  const hasGlb = Boolean(product.modelGlbUrl);
  const hasUsdz = Boolean(product.modelUsdzUrl);
  const secureGlb = hasGlb && String(product.modelGlbUrl).startsWith("https://");
  const size = Number(product.modelFileSizeMB || 0);
  const sizeOk = !size || size <= 25;
  const status = [
    ["GLB model", hasGlb, "Needed for web/Android 3D and AR."],
    ["HTTPS URL", secureGlb, "AR files should be served from HTTPS."],
    ["iPhone USDZ", hasUsdz, "Recommended for iPhone/iPad Quick Look."],
    ["Model size", sizeOk, size ? `${size} MB detected. Keep under 25 MB when possible.` : "No model size recorded."]
  ];
  const score = status.filter((item) => item[1]).length;

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">AR readiness</p>
        <span className={`rounded-full px-2 py-1 text-[11px] font-black ${score >= 3 ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"}`}>
          {score >= 3 ? "Ready" : "Needs check"}
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        {status.map(([label, ok, help]) => (
          <div key={label} className="flex gap-2 text-xs">
            {ok ? <CheckCircle2 size={15} className="shrink-0 text-teal-600" /> : <AlertTriangle size={15} className="shrink-0 text-orange-600" />}
            <p className={checkClass(ok)}><span className="font-black">{label}:</span> {help}</p>
          </div>
        ))}
      </div>
      {hasGlb ? (
        <a href={product.modelGlbUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-brand">
          Open model <ExternalLink size={13} />
        </a>
      ) : null}
    </div>
  );
}
