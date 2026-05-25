import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DataTable } from "@/components/dashboards/DataTable";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";

export const dynamic = "force-dynamic";

export default async function SuperAdminAnalyticsPage() {
  await connectDB();
  const events = await Analytics.find().populate("businessId", "businessName slug").sort({ createdAt: -1 }).limit(100).lean();
  return (
    <DashboardShell role="SUPER_ADMIN" title="Global analytics">
      <DataTable columns={["Business", "Event", "Device", "Date"]} rows={events.map((event) => (
        <tr key={String(event._id)} className="border-t">
          <td className="px-4 py-3 font-bold">{event.businessId?.businessName}</td>
          <td className="px-4 py-3">{event.eventType}</td>
          <td className="px-4 py-3">{event.device}</td>
          <td className="px-4 py-3">{new Date(event.createdAt).toLocaleString()}</td>
        </tr>
      ))} />
    </DashboardShell>
  );
}
