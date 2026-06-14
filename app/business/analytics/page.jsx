import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { AnalyticsView } from "@/components/dashboards/AnalyticsView";

export default function BusinessAnalyticsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Analytics">
      <AnalyticsView />
    </DashboardShell>
  );
}
