import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { QRCenter } from "@/components/dashboards/QRCenter";

export default function StaffQrsPage() {
  return (
    <DashboardShell role="STAFF" title="QR quick links">
      <QRCenter />
    </DashboardShell>
  );
}
