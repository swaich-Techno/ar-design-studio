import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { LeadInbox } from "@/components/dashboards/LeadInbox";

export default function SuperAdminLeadsPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Global lead inbox">
      <LeadInbox />
    </DashboardShell>
  );
}
