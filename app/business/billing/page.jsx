import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { BillingView } from "@/components/dashboards/BillingView";

export default function BusinessBillingPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Billing and invoices">
      <BillingView />
    </DashboardShell>
  );
}
