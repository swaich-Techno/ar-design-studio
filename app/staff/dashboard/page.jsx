import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { AnalyticsView } from "@/components/dashboards/AnalyticsView";

export default function StaffDashboardPage() {
  return (
    <DashboardShell role="STAFF" title="Staff dashboard">
      <AnalyticsView staffMode />
    </DashboardShell>
  );
}
