import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DemoRequestManager } from "@/components/dashboards/DemoRequestManager";

export default function SuperAdminDemoRequestsPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Demo requests">
      <DemoRequestManager />
    </DashboardShell>
  );
}
