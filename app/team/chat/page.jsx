import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ClientChat } from "@/components/dashboards/ClientChat";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TeamChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/team/login");
  return (
    <DashboardShell role={user.role} title="Client chat">
      <ClientChat internal />
    </DashboardShell>
  );
}
