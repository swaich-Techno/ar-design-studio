import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { ROLES, canStaff } from "@/lib/permissions";
import { sanitizeProductInput } from "@/lib/productFields";
import Business from "@/models/Business";
import Product from "@/models/Product";

const WRITE_ROLES = [ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER, ROLES.BUSINESS_STAFF, ROLES.STAFF];
const READ_ROLES = [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.SUPPORT_STAFF, ...WRITE_ROLES];

export async function GET(_request, { params }) {
  const { user, error } = await requireUser(READ_ROLES);
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;
  return json({ product });
}

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser(WRITE_ROLES);
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;

  if ([ROLES.BUSINESS_STAFF, ROLES.STAFF].includes(user.role)) {
    const update = {};
    if (body.isAvailable !== undefined && canStaff(user, "canEditAvailability")) update.isAvailable = Boolean(body.isAvailable);
    if (body.isSoldOut !== undefined && canStaff(user, "canEditAvailability")) update.isSoldOut = Boolean(body.isSoldOut);
    if (body.price !== undefined && canStaff(user, "canEditProducts")) update.price = Number(body.price || 0);
    Object.assign(product, update);
  } else {
    const next = sanitizeProductInput({ ...product.toObject(), ...body });
    const wasARProduct = Boolean(product.hasARModel);
    if (!wasARProduct && next.hasARModel) {
      const business = await Business.findById(product.businessId);
      const arCount = await Product.countDocuments({ businessId: product.businessId, hasARModel: true });
      if (arCount >= Number(business?.arProductLimit || 0)) {
        return json({ error: `${business?.subscriptionPlan || "Starter"} includes ${business?.arProductLimit || 0} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
      }
    }
    Object.assign(product, next);
  }
  await product.save();
  return json({ product });
}

export async function DELETE(request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER]);
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;
  await product.deleteOne();
  if ([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN].includes(user.role)) {
    await writeAudit({ actor: user, action: "product deleted", targetType: "Product", targetId: params.id, description: product.name, request });
  }
  return json({ ok: true });
}
