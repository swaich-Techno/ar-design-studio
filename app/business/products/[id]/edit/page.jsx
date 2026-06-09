import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProductForm } from "@/components/forms/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Edit product">
      <ProductForm productId={id} />
    </DashboardShell>
  );
}
