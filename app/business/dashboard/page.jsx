import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { UsageBar } from "@/components/dashboards/UsageBar";
import { ClientHealthPanel } from "@/components/dashboards/ClientHealthPanel";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import Business from "@/models/Business";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function BusinessDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/business/login");
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  const [products, arProducts, pendingApprovals, scans, whatsapp, arViews, staff] = await Promise.all([
    Product.countDocuments({ businessId: user.businessId }),
    Product.countDocuments({ businessId: user.businessId, hasARModel: true }),
    Product.countDocuments({ businessId: user.businessId, publicationStatus: { $ne: "PUBLISHED" } }),
    Analytics.countDocuments({ businessId: user.businessId }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "whatsapp_click" }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "ar_view" }),
    User.countDocuments({ businessId: user.businessId, role: "STAFF" })
  ]);
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Business dashboard">
      <div className="grid gap-6">
        <StatGrid items={[
          { label: "Products", value: `${products}/${business?.productLimit || 0}` },
          { label: "QR scans", value: scans },
          { label: "WhatsApp clicks", value: whatsapp },
          { label: "AR views", value: arViews }
        ]} />
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">{business?.businessName}</h2>
          <p className="mt-2 text-slate-600">Public catalogue: /b/{business?.slug}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UsageBar label="Storage" used={Math.round(Number(business?.usedStorageMB || 0) * 100) / 100} limit={business?.storageLimitMB || 0} unit=" MB" />
            <UsageBar label="AR products" used={arProducts} limit={business?.arProductLimit || 0} zeroLabel="Not included" />
            <UsageBar label="Products" used={products} limit={business?.productLimit || 0} />
            <UsageBar label="Staff" used={staff} limit={business?.staffLimit || 0} />
          </div>
          <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-brand">
            Fair usage: image and AR model hosting is limited by your plan. Upgrade or request an add-on when storage or AR products reach the limit.
          </p>
        </div>
        <ClientHealthPanel business={business} products={products} arProducts={arProducts} staff={staff} pendingApprovals={pendingApprovals} />
      </div>
    </DashboardShell>
  );
}
