import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DataTable } from "@/components/dashboards/DataTable";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function SuperAdminProductsPage() {
  await connectDB();
  const products = await Product.find().populate("businessId", "businessName slug").sort({ createdAt: -1 }).lean();
  return (
    <DashboardShell role="SUPER_ADMIN" title="All products">
      <DataTable columns={["Product", "Business", "Price", "AR", "Views"]} rows={products.map((product) => (
        <tr key={String(product._id)} className="border-t">
          <td className="px-4 py-3 font-bold">{product.name}</td>
          <td className="px-4 py-3">{product.businessId?.businessName}</td>
          <td className="px-4 py-3">₹{product.discountPrice || product.price || 0}</td>
          <td className="px-4 py-3">{product.modelGlbUrl ? "Ready" : "Missing"}</td>
          <td className="px-4 py-3">{product.views || 0}</td>
        </tr>
      ))} />
    </DashboardShell>
  );
}
