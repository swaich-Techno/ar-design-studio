import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ClientChat } from "@/components/dashboards/ClientChat";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BusinessChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/business/login");
  return (
    <DashboardShell role={user.role} title="Team chat">
      <ClientChat />
    </DashboardShell>
  );
}
