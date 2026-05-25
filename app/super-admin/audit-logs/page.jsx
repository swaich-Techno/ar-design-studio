import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DataTable } from "@/components/dashboards/DataTable";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export const dynamic = "force-dynamic";

export default async function SuperAdminAuditLogsPage() {
  await connectDB();
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean();
  return (
    <DashboardShell role="SUPER_ADMIN" title="Audit logs">
      <DataTable columns={["Action", "Actor", "Target", "Description", "Date"]} rows={logs.map((log) => (
        <tr key={String(log._id)} className="border-t">
          <td className="px-4 py-3 font-bold">{log.action}</td>
          <td className="px-4 py-3">{log.actorRole}</td>
          <td className="px-4 py-3">{log.targetType}</td>
          <td className="px-4 py-3">{log.description}</td>
          <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
        </tr>
      ))} />
    </DashboardShell>
  );
}
