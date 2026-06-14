import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { TableManager } from "@/components/dashboards/TableManager";

export default function BusinessTablesPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Table QR codes">
      <TableManager />
    </DashboardShell>
  );
}
