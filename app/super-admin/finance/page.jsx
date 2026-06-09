import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { FinanceManager } from "@/components/dashboards/FinanceManager";

export default function SuperAdminFinancePage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Finance dashboard">
      <FinanceManager />
    </DashboardShell>
  );
}
