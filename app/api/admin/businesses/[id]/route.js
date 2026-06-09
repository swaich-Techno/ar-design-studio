import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { planDefaults } from "@/lib/plans";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const updates = {};
  const textFields = ["businessName", "ownerName", "email", "phone", "whatsapp", "category", "subscriptionStatus"];
  for (const field of textFields) if (body[field] !== undefined) updates[field] = body[field];
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
  if (body.subscriptionPlan !== undefined) {
    const defaults = planDefaults(body.subscriptionPlan);
    Object.assign(updates, defaults);
  }
  for (const field of ["productLimit", "staffLimit", "storageLimitMB", "arProductLimit", "usedStorageMB"]) {
    if (body[field] !== undefined) updates[field] = Number(body[field] || 0);
  }
  const business = await Business.findByIdAndUpdate(params.id, updates, { new: true });
  if (!business) return json({ error: "Business not found." }, 404);
  await writeAudit({
    actor: user,
    action: body.subscriptionPlan ? "subscription changed" : body.isActive === false ? "business deactivated" : "business updated",
    targetType: "Business",
    targetId: params.id,
    description: business.businessName,
    request
  });
  return json({ business });
}

export async function DELETE(request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN]);
  if (error) return error;
  await connectDB();
  const business = await Business.findByIdAndDelete(params.id);
  if (!business) return json({ error: "Business not found." }, 404);
  await writeAudit({ actor: user, action: "business deleted", targetType: "Business", targetId: params.id, description: business.businessName, request });
  return json({ ok: true });
}
