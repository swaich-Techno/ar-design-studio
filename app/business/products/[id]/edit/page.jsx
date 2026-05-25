import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProductForm } from "@/components/forms/ProductForm";

export default function EditProductPage({ params }) {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Edit product">
      <ProductForm productId={params.id} />
    </DashboardShell>
  );
}
