import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ReportsView } from "@/components/dashboards/ReportsView";

export default function SuperAdminReportsPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Reports">
      <ReportsView />
    </DashboardShell>
  );
}
