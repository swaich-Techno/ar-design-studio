import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { json, requireUser } from "@/lib/api";
import { DEFAULT_STAFF_PERMISSIONS, ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import User from "@/models/User";

export async function GET() {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
  if (error) return error;
  await connectDB();
  const query = user.role === ROLES.SUPER_ADMIN ? { role: ROLES.STAFF } : { role: ROLES.STAFF, businessId: user.businessId };
  const staff = await User.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean();
  return json({ staff });
}

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  if (!body.name || !body.email || !body.password) return json({ error: "Name, email, and password are required." }, 400);
  await connectDB();
  const businessId = user.role === ROLES.SUPER_ADMIN ? body.businessId : user.businessId;
  if (!businessId) return json({ error: "Business is required." }, 400);
  const business = await Business.findById(businessId);
  if (!business) return json({ error: "Business not found." }, 404);
  const count = await User.countDocuments({ businessId, role: ROLES.STAFF });
  if (count >= business.staffLimit && user.role !== ROLES.SUPER_ADMIN) return json({ error: "Staff limit reached for this plan." }, 403);
  const email = String(body.email).toLowerCase().trim();
  const exists = await User.exists({ email });
  if (exists) return json({ error: "Email already exists." }, 409);
  const staff = await User.create({
    name: body.name,
    email,
    passwordHash: await hashPassword(body.password),
    role: ROLES.STAFF,
    businessId,
    permissions: { ...DEFAULT_STAFF_PERMISSIONS, ...(body.permissions || {}) },
    isActive: true
  });
  const safe = staff.toObject();
  delete safe.passwordHash;
  return json({ staff: safe }, 201);
}
