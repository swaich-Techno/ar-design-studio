import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { LeadInbox } from "@/components/dashboards/LeadInbox";

export default function BusinessLeadsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Lead inbox">
      <LeadInbox />
    </DashboardShell>
  );
}
