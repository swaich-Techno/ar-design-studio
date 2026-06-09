import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { SupportManager } from "@/components/dashboards/SupportManager";

export default function SuperAdminSupportPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Support tickets">
      <SupportManager />
    </DashboardShell>
  );
}
