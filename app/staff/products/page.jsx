import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProductsClient } from "@/components/dashboards/ProductsClient";

export default function StaffProductsPage() {
  return (
    <DashboardShell role="STAFF" title="Assigned products">
      <ProductsClient staffMode />
    </DashboardShell>
  );
}
