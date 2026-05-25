import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ReportsView } from "@/components/dashboards/ReportsView";

export default function BusinessReportsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Monthly reports">
      <ReportsView />
    </DashboardShell>
  );
}
