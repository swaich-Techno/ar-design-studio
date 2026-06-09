import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { CampaignManager } from "@/components/dashboards/CampaignManager";

export default function BusinessCampaignsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Campaign QR codes">
      <CampaignManager />
    </DashboardShell>
  );
}
