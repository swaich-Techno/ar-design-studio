import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { DataTable } from "@/components/dashboards/DataTable";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function SuperAdminUsersPage() {
  await connectDB();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  return (
    <DashboardShell role="SUPER_ADMIN" title="Users">
      <DataTable columns={["Name", "Email", "Role", "Status"]} rows={users.map((user) => (
        <tr key={String(user._id)} className="border-t">
          <td className="px-4 py-3 font-bold">{user.name}</td>
          <td className="px-4 py-3">{user.email}</td>
          <td className="px-4 py-3">{user.role}</td>
          <td className="px-4 py-3">{user.isActive ? "Active" : "Inactive"}</td>
        </tr>
      ))} />
    </DashboardShell>
  );
}
