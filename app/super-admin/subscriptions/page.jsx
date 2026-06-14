import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DataTable } from "@/components/dashboards/DataTable";
import { UsageBar } from "@/components/dashboards/UsageBar";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function SuperAdminSubscriptionsPage() {
  await connectDB();
  const [businesses, usage] = await Promise.all([
    Business.find().sort({ createdAt: -1 }).lean(),
    Product.aggregate([
      { $group: { _id: "$businessId", productCount: { $sum: 1 }, arProductCount: { $sum: { $cond: ["$hasARModel", 1, 0] } } } }
    ])
  ]);
  const usageMap = new Map(usage.map((item) => [String(item._id), item]));
  return (
    <DashboardShell role="SUPER_ADMIN" title="Subscriptions">
      <DataTable columns={["Business", "Plan", "Status", "Plan usage"]} rows={businesses.map((business) => {
        const counts = usageMap.get(String(business._id)) || {};
        return (
          <tr key={String(business._id)} className="border-t align-top">
            <td className="px-4 py-3 font-bold">{business.businessName}</td>
            <td className="px-4 py-3">{business.subscriptionPlan}</td>
            <td className="px-4 py-3">{business.subscriptionStatus}</td>
            <td className="grid min-w-72 gap-3 px-4 py-3">
              <UsageBar label="Storage" used={Math.round(Number(business.usedStorageMB || 0) * 100) / 100} limit={business.storageLimitMB || 0} unit=" MB" />
              <UsageBar label="AR products" used={counts.arProductCount || 0} limit={business.arProductLimit || 0} zeroLabel="Not included" />
              <UsageBar label="Products" used={counts.productCount || 0} limit={business.productLimit || 0} />
            </td>
          </tr>
        );
      })} />
    </DashboardShell>
  );
}
