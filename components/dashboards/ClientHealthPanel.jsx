import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ClientHealthPanel({ business, products = 0, arProducts = 0, staff = 0, pendingApprovals = 0 }) {
  const storagePercent = business?.storageLimitMB ? Math.round((Number(business.usedStorageMB || 0) / Number(business.storageLimitMB)) * 100) : 0;
  const productPercent = business?.productLimit ? Math.round((Number(products || 0) / Number(business.productLimit)) * 100) : 0;
  const arPercent = business?.arProductLimit ? Math.round((Number(arProducts || 0) / Number(business.arProductLimit)) * 100) : 0;
  const staffPercent = business?.staffLimit ? Math.round((Number(staff || 0) / Number(business.staffLimit)) * 100) : 0;
  const risks = [
    storagePercent >= 80 ? "Storage is close to the plan limit." : "",
    productPercent >= 80 ? "Product slots are close to the plan limit." : "",
    arPercent >= 80 ? "AR product slots are close to the plan limit." : "",
    staffPercent >= 80 ? "Staff seats are close to the plan limit." : "",
    pendingApprovals ? `${pendingApprovals} product approval item(s) need action.` : "",
    business?.paymentStatus === "OVERDUE" ? "Payment is overdue." : "",
    business?.subscriptionStatus === "EXPIRED" ? "Subscription is expired." : ""
  ].filter(Boolean);
  const score = Math.max(0, 100 - risks.length * 14);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Client health score</p>
          <h2 className="mt-1 text-3xl font-black">{score}/100</h2>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-black ${score >= 75 ? "bg-teal-50 text-teal-800" : "bg-orange-50 text-orange-800"}`}>
          {score >= 75 ? "Healthy" : "Needs attention"}
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        {risks.length ? risks.map((risk) => (
          <p key={risk} className="flex gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
            <AlertTriangle size={18} className="shrink-0" /> {risk}
          </p>
        )) : (
          <p className="flex gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
            <CheckCircle2 size={18} className="shrink-0" /> Usage, billing, and approval status look good.
          </p>
        )}
      </div>
    </div>
  );
}
