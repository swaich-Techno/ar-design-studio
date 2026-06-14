import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProfileForm } from "@/components/dashboards/ProfileForm";

export default function BusinessProfilePage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Business profile">
      <ProfileForm />
    </DashboardShell>
  );
}
