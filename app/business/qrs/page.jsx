import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { QRCenter } from "@/components/dashboards/QRCenter";

export default function BusinessQrsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="QR Center">
      <QRCenter />
    </DashboardShell>
  );
}
