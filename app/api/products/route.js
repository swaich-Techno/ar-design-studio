import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { productPublicUrl } from "@/lib/qr";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { ROLES, canStaff } from "@/lib/permissions";
import { sanitizeProductInput } from "@/lib/productFields";
import Business from "@/models/Business";
import Product from "@/models/Product";

const WRITE_ROLES = [ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER, ROLES.BUSINESS_STAFF, ROLES.STAFF];
const READ_ROLES = [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.SUPPORT_STAFF, ...WRITE_ROLES];

export async function GET() {
  const { user, error } = await requireUser(READ_ROLES);
  if (error) return error;
  await connectDB();
  const query = [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.SUPPORT_STAFF].includes(user.role)
    ? {}
    : { businessId: user.businessId };
  const products = await Product.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  const business = user.businessId ? await Business.findById(user.businessId).lean() : null;
  return json({
    products: products.map((product) => ({
      ...product,
      _id: String(product._id),
      businessId: String(product.businessId),
      publicUrl: business ? productPublicUrl(business.slug, product.slug) : ""
    }))
  });
}

export async function POST(request) {
  const { user, error } = await requireUser(WRITE_ROLES);
  if (error) return error;
  if ([ROLES.BUSINESS_STAFF, ROLES.STAFF].includes(user.role) && !canStaff(user, "canEditProducts")) {
    return json({ error: "Staff product editing is disabled." }, 403);
  }
  const body = await request.json().catch(() => ({}));
  const productData = sanitizeProductInput(body);
  if (!productData.name) return json({ error: "Product name is required." }, 400);

  await connectDB();
  const business = await Business.findById(user.businessId);
  if (!business || !business.isActive) return json({ error: "Business unavailable." }, 403);
  const count = await Product.countDocuments({ businessId: business._id });
  if (count >= business.productLimit) return json({ error: "Product limit reached for this plan." }, 403);

  if (productData.hasARModel) {
    const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
    if (arCount >= Number(business.arProductLimit || 0)) {
      return json({ error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
    }
  }

  const baseSlug = slugify(productData.name);
  const exists = await Product.exists({ businessId: business._id, slug: baseSlug });
  const product = await Product.create({
    ...productData,
    businessId: business._id,
    slug: exists ? uniqueSlug(productData.name, Date.now().toString()) : baseSlug
  });

  return json({ product: { ...product.toObject(), publicUrl: productPublicUrl(business.slug, product.slug) } }, 201);
}
