import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import Payment from "@/models/Payment";
import SupportTicket from "@/models/SupportTicket";

export const dynamic = "force-dynamic";

export default async function TeamDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/team/login");
  await connectDB();
  const [clients, productsPending, outstanding, tickets] = await Promise.all([
    Business.countDocuments(),
    Product.countDocuments({ publicationStatus: { $ne: "PUBLISHED" } }),
    Payment.find({ status: { $in: ["PENDING", "OVERDUE"] } }).lean(),
    SupportTicket.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS"] } })
  ]);
  const outstandingAmount = outstanding.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return (
    <DashboardShell role={user.role} title="Team dashboard">
      <StatGrid items={[
        { label: "Clients", value: clients },
        { label: "Approvals pending", value: productsPending },
        { label: "Outstanding", value: `Rs. ${outstandingAmount}` },
        { label: "Open support tickets", value: tickets }
      ]} />
    </DashboardShell>
  );
}
