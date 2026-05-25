import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { SalaryManager } from "@/components/dashboards/SalaryManager";

export default function SuperAdminSalariesPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Salary management">
      <SalaryManager />
    </DashboardShell>
  );
}
