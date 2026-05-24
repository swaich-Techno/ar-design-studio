import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { AnalyticsView } from "@/components/dashboards/AnalyticsView";

export default function StaffLeadsPage() {
  return (
    <DashboardShell role="STAFF" title="Leads and order activity">
      <AnalyticsView staffMode />
    </DashboardShell>
  );
}
