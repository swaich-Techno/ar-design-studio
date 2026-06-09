import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ClientChat } from "@/components/dashboards/ClientChat";

export const dynamic = "force-dynamic";

export default function SuperAdminChatPage() {
  return (
    <DashboardShell role="SUPER_ADMIN" title="Client chat">
      <ClientChat internal />
    </DashboardShell>
  );
}
