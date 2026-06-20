import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import TableQR from "@/models/TableQR";

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const table = await TableQR.findById(params.id);
  if (!table) return json({ error: "Table QR not found." }, 404);
  const denied = requireBusinessAccess(user, table.businessId);
  if (denied) return denied;
  if (body.tableName !== undefined) table.tableName = body.tableName;
  if (body.isActive !== undefined) table.isActive = Boolean(body.isActive);
  await table.save();
  return json({ table });
}

export async function DELETE(_request, { params }) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  await connectDB();
  const table = await TableQR.findById(params.id);
  if (!table) return json({ error: "Table QR not found." }, 404);
  const denied = requireBusinessAccess(user, table.businessId);
  if (denied) return denied;
  await table.deleteOne();
  return json({ ok: true });
}
