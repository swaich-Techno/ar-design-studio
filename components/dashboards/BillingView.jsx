"use client";

import { useEffect, useState } from "react";
import { StatGrid } from "@/components/dashboards/StatGrid";

export function BillingView() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/billing", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Billing could not be loaded.");
        setData(payload);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="rounded-[26px] border border-red-200 bg-red-50 p-5 font-bold text-red-700">{error}</div>;
  if (!data) return <p className="font-bold text-slate-600">Loading billing...</p>;

  const business = data.business || {};
  const payments = data.payments || [];
  const paid = payments.filter((payment) => payment.status === "PAID").reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pending = payments.filter((payment) => ["PENDING", "OVERDUE"].includes(payment.status)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="grid gap-6">
      <StatGrid items={[
        { label: "Plan", value: business.subscriptionPlan || "-" },
        { label: "Subscription", value: business.subscriptionStatus || "-" },
        { label: "Paid", value: `Rs. ${paid}` },
        { label: "Outstanding", value: `Rs. ${pending || business.outstandingAmount || 0}` }
      ]} />
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-xl font-black">Invoices and payments</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Manual records today. Razorpay/Stripe automation can connect later.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-bold">{payment.invoiceNumber}</td>
                  <td className="px-4 py-3">{payment.description || payment.type}</td>
                  <td className="px-4 py-3">Rs. {payment.amount || 0}</td>
                  <td className="px-4 py-3">{payment.status}</td>
                  <td className="px-4 py-3">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
              {!payments.length ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center font-bold text-slate-500">No invoices recorded yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
