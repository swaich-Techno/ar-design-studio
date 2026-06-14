import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { TeamManager } from "@/components/dashboards/TeamManager";

export default function SuperAdminTeamPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Internal team">
      <TeamManager />
    </DashboardShell>
  );
}
