import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import AuditLog from "@/models/AuditLog";
import Business from "@/models/Business";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
  await connectDB();
  const [businesses, products, users, scans, audit] = await Promise.all([
    Business.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Analytics.countDocuments(),
    AuditLog.find().sort({ createdAt: -1 }).limit(6).lean()
  ]);
  return (
    <DashboardShell role="SUPER_ADMIN" title="Super Admin dashboard">
      <div className="grid gap-6">
        <StatGrid items={[
          { label: "Businesses", value: businesses },
          { label: "Products", value: products },
          { label: "Users", value: users },
          { label: "Total scans/events", value: scans }
        ]} />
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Recent audit logs</h2>
          <div className="mt-4 grid gap-3">
            {audit.map((item) => <p key={String(item._id)} className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold">{item.action} • {item.description}</p>)}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
