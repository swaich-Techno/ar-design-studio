import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProductsClient } from "@/components/dashboards/ProductsClient";

export default function BusinessProductsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Products">
      <ProductsClient />
    </DashboardShell>
  );
}
