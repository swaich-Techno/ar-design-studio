import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StaffManager } from "@/components/dashboards/StaffManager";

export default function BusinessStaffPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Client manager accounts">
      <StaffManager />
    </DashboardShell>
  );
}
