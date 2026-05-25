import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { LeadInbox } from "@/components/dashboards/LeadInbox";

export default function StaffLeadsPage() {
  return (
    <DashboardShell role="STAFF" title="Leads and order activity">
      <LeadInbox />
    </DashboardShell>
  );
}
