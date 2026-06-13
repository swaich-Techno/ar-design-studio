import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgeCheck, Banknote, Building2, CheckSquare, LifeBuoy, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import AuditLog from "@/models/AuditLog";
import Business from "@/models/Business";
import Expense from "@/models/Expense";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import SupportTicket from "@/models/SupportTicket";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default async function SuperAdminDashboardPage() {
  await connectDB();
  const [
    businesses,
    activeBusinesses,
    trialBusinesses,
    frozenBusinesses,
    products,
    arProducts,
    pendingProducts,
    users,
    scans,
    audit,
    payments,
    expenses,
    overdue,
    pendingPayments,
    pendingDemoRequests
  ] = await Promise.all([
    Business.countDocuments(),
    Business.countDocuments({ subscriptionStatus: "ACTIVE" }),
    Business.countDocuments({ subscriptionStatus: "TRIAL" }),
    Business.countDocuments({ $or: [{ subscriptionStatus: "FROZEN" }, { isFrozenForNonPayment: true }] }),
    Product.countDocuments(),
    Product.countDocuments({ hasARModel: true }),
    Product.countDocuments({ publicationStatus: { $ne: "PUBLISHED" } }),
    User.countDocuments(),
    Analytics.countDocuments(),
    AuditLog.find().sort({ createdAt: -1 }).limit(6).lean(),
    Payment.find().lean(),
    Expense.find().lean(),
    Payment.countDocuments({ status: "OVERDUE" }),
    Payment.countDocuments({ status: "PENDING" }),
    SupportTicket.countDocuments({ ticketType: "DEMO_REQUEST", demoStatus: "REQUESTED" })
  ]);
  const paymentsReceived = payments.filter((payment) => payment.status === "PAID").reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = payments.filter((payment) => ["PENDING", "OVERDUE"].includes(payment.status)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const costs = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const profit = paymentsReceived - costs;
  const urgentActions = [
    pendingDemoRequests ? [`Approve ${pendingDemoRequests} free demo request(s)`, "/super-admin/demo-requests", CheckSquare] : null,
    pendingProducts ? [`Review ${pendingProducts} product approval(s)`, "/super-admin/approvals", CheckSquare] : null,
    overdue ? [`Follow up ${overdue} overdue payment(s)`, "/super-admin/finance", Banknote] : null,
    frozenBusinesses ? [`Check ${frozenBusinesses} frozen client(s)`, "/super-admin/businesses", AlertTriangle] : null,
    pendingPayments ? [`Track ${pendingPayments} pending invoice(s)`, "/super-admin/subscriptions", Banknote] : null
  ].filter(Boolean);

  return (
    <DashboardShell role="SUPER_ADMIN" title="Super Admin command center">
      <div className="grid gap-6">
        <section className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Platform owner view</p>
              <h2 className="mt-2 text-3xl font-black">Revenue, approvals, clients, and operating risk in one place.</h2>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-300">
                Prioritize payment follow-up, AR/product approval, client health, and support work before it becomes a delivery problem.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">Estimated net</p>
              <p className="mt-2 text-3xl font-black">{money(profit)}</p>
              <p className="mt-1 text-xs font-bold text-slate-300">Paid revenue minus recorded costs</p>
            </div>
          </div>
        </section>

        <StatGrid items={[
          { label: "Businesses", value: businesses, helper: `${activeBusinesses} active, ${trialBusinesses} trial`, tone: "brand" },
          { label: "Products", value: products, helper: `${arProducts} with AR models`, tone: "ink" },
          { label: "Users", value: users, helper: "All platform accounts", tone: "ink" },
          { label: "Total events", value: scans, helper: "Scans, leads, AR, calls, shares", tone: "accent" }
        ]} />

        <StatGrid items={[
          { label: "Payments received", value: money(paymentsReceived), helper: "Collected invoices", tone: "brand" },
          { label: "Outstanding", value: money(outstanding), helper: `${pendingPayments} pending, ${overdue} overdue`, tone: overdue ? "danger" : "warning" },
          { label: "Costings", value: money(costs), helper: "Recorded platform expenses", tone: "ink" },
          { label: "Approvals due", value: pendingProducts + pendingDemoRequests, helper: `${pendingProducts} product, ${pendingDemoRequests} demo`, tone: pendingProducts || pendingDemoRequests ? "warning" : "brand" }
        ]} />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Priority queue</p>
                <h2 className="mt-1 text-2xl font-black">What needs owner attention</h2>
              </div>
              <ShieldCheck className="text-brand" />
            </div>
            <div className="mt-5 grid gap-3">
              {urgentActions.length ? urgentActions.map(([label, href, Icon]) => (
                <Link key={label} href={href} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-teal-50 hover:text-brand">
                  <span className="flex items-center gap-3"><Icon size={18} /> {label}</span>
                  <ArrowRight size={16} />
                </Link>
              )) : (
                <p className="flex gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
                  <BadgeCheck size={18} /> No urgent approval, overdue, or frozen-client action detected.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Operating snapshot</p>
                <h2 className="mt-1 text-2xl font-black">Business health mix</h2>
              </div>
              <Building2 className="text-brand" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-teal-50 p-4">
                <p className="text-2xl font-black text-teal-900">{activeBusinesses}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-teal-700">Active</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-2xl font-black text-amber-900">{trialBusinesses}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-amber-700">Trial</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-2xl font-black text-red-900">{frozenBusinesses}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-red-700">Frozen risk</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link href="/super-admin/businesses" className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700 transition hover:bg-slate-100">Open businesses</Link>
              <Link href="/super-admin/support" className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700 transition hover:bg-slate-100"><LifeBuoy className="mr-2 inline" size={16} />Support desk</Link>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Recent audit logs</h2>
          <div className="mt-4 grid gap-3">
            {audit.length ? audit.map((item) => (
              <p key={String(item._id)} className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
                <span className="font-black text-ink">{item.action}</span> - {item.description}
              </p>
            )) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">No audit logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
