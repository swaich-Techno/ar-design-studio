import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProductForm } from "@/components/forms/ProductForm";

export default function NewProductPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Add product">
      <ProductForm />
    </DashboardShell>
  );
}
