import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { slugify } from "@/lib/slugify";
import Business from "@/models/Business";

export async function GET() {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  return json({ business });
}

export async function PATCH(request) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const allowed = ["businessName", "ownerName", "phone", "whatsapp", "logoUrl", "coverImageUrl", "address", "mapLink", "instagram", "category"];
  const update = {};
  for (const key of allowed) if (body[key] !== undefined) update[key] = body[key];
  if (body.businessName) update.slug = slugify(body.businessName);
  const business = await Business.findByIdAndUpdate(user.businessId, update, { new: true }).lean();
  return json({ business });
}
