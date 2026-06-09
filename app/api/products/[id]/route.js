import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { mb } from "@/lib/plans";
import { ROLES, canStaff } from "@/lib/permissions";
import Business from "@/models/Business";
import Product from "@/models/Product";

function toList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET(_request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;
  return json({ product });
}

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;

  if (user.role === ROLES.STAFF) {
    const update = {};
    if (body.isAvailable !== undefined && canStaff(user, "canEditAvailability")) update.isAvailable = Boolean(body.isAvailable);
    if (body.price !== undefined && canStaff(user, "canEditProducts")) update.price = Number(body.price || 0);
    Object.assign(product, update);
  } else {
    const wasARProduct = Boolean(product.hasARModel);
    const nextModelGlbUrl = body.modelGlbUrl !== undefined ? body.modelGlbUrl : product.modelGlbUrl;
    const nextModelUsdzUrl = body.modelUsdzUrl !== undefined ? body.modelUsdzUrl : product.modelUsdzUrl;
    const nextHasARModel = Boolean(nextModelGlbUrl || nextModelUsdzUrl || body.hasARModel);

    if (!wasARProduct && nextHasARModel) {
      const business = await Business.findById(product.businessId);
      const arCount = await Product.countDocuments({ businessId: product.businessId, hasARModel: true });
      if (arCount >= Number(business?.arProductLimit || 0)) {
        return json({ error: `${business?.subscriptionPlan || "Starter"} includes ${business?.arProductLimit || 0} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
      }
    }

    const fields = ["name", "category", "description", "shortDescription", "imageUrl", "modelGlbUrl", "modelUsdzUrl", "offerText"];
    for (const field of fields) if (body[field] !== undefined) product[field] = body[field];
    if (body.price !== undefined) product.price = Number(body.price || 0);
    if (body.discountPrice !== undefined) product.discountPrice = Number(body.discountPrice || 0);
    if (body.fileSizeMB !== undefined) product.fileSizeMB = mb(body.fileSizeMB || 0);
    if (body.modelFileSizeMB !== undefined) product.modelFileSizeMB = mb(body.modelFileSizeMB || 0);
    if (body.isAvailable !== undefined) product.isAvailable = Boolean(body.isAvailable);
    if (body.isFeatured !== undefined) product.isFeatured = Boolean(body.isFeatured);
    product.hasARModel = nextHasARModel;
    if (body.galleryImages !== undefined) product.galleryImages = toList(body.galleryImages);
    if (body.tags !== undefined) product.tags = toList(body.tags);
  }
  await product.save();
  return json({ product });
}

export async function DELETE(request, { params }) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return json({ error: "Product not found." }, 404);
  const denied = requireBusinessAccess(user, product.businessId);
  if (denied) return denied;
  await product.deleteOne();
  if (user.role === ROLES.SUPER_ADMIN) {
    await writeAudit({ actor: user, action: "product deleted", targetType: "Product", targetId: params.id, description: product.name, request });
  }
  return json({ ok: true });
}
