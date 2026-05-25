import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { AnalyticsView } from "@/components/dashboards/AnalyticsView";

export default function SuperAdminAnalyticsPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Global analytics">
      <AnalyticsView />
    </DashboardShell>
  );
}
