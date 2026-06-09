import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ApprovalManager } from "@/components/dashboards/ApprovalManager";

export default function SuperAdminApprovalsPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Approval queue">
      <ApprovalManager />
    </DashboardShell>
  );
}
