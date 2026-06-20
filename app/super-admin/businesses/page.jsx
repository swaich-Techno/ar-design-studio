import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { AdminBusinessManager } from "@/components/dashboards/AdminBusinessManager";

export default function SuperAdminBusinessesPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Businesses">
      <AdminBusinessManager />
    </DashboardShell>
  );
}
