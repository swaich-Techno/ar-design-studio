import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import User from "@/models/User";

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const staff = await User.findById(params.id);
  if (!staff || staff.role !== ROLES.STAFF) return json({ error: "Staff not found." }, 404);
  const denied = requireBusinessAccess(user, staff.businessId);
  if (denied) return denied;
  if (body.name !== undefined) staff.name = body.name;
  if (body.isActive !== undefined) staff.isActive = Boolean(body.isActive);
  if (body.permissions !== undefined) staff.permissions = { ...staff.permissions, ...body.permissions };
  await staff.save();
  const safe = staff.toObject();
  delete safe.passwordHash;
  return json({ staff: safe });
}
