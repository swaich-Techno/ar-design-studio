import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { productPublicUrl } from "@/lib/qr";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { ROLES, canStaff } from "@/lib/permissions";
import { mb } from "@/lib/plans";
import Business from "@/models/Business";
import Product from "@/models/Product";

const PRODUCT_TYPES = ["STANDARD", "FABRIC", "GARMENT", "FURNITURE", "JEWELLERY", "FOOD", "REAL_ESTATE", "AUTOMOBILE"];
const STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "MADE_TO_ORDER"];

function sanitize(body) {
  const hasARModel = Boolean(body.modelGlbUrl || body.modelUsdzUrl || body.hasARModel);
  return {
    name: body.name,
    category: body.category || "General",
    price: Number(body.price || 0),
    discountPrice: Number(body.discountPrice || 0),
    description: body.description || "",
    shortDescription: body.shortDescription || "",
    imageUrl: body.imageUrl || "",
    galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : String(body.galleryImages || "").split(",").map((x) => x.trim()).filter(Boolean),
    fileSizeMB: mb(body.fileSizeMB || 0),
    productType: PRODUCT_TYPES.includes(body.productType) ? body.productType : "STANDARD",
    fabricImageUrl: body.fabricImageUrl || "",
    stitchedPreviewImageUrl: body.stitchedPreviewImageUrl || "",
    stitchedPreviewNotes: body.stitchedPreviewNotes || "",
    supportsRotation: Boolean(body.supportsRotation || hasARModel),
    modelGlbUrl: body.modelGlbUrl || "",
    modelUsdzUrl: body.modelUsdzUrl || "",
    modelFileSizeMB: mb(body.modelFileSizeMB || 0),
    hasARModel,
    offerText: body.offerText || "",
    tags: Array.isArray(body.tags) ? body.tags : String(body.tags || "").split(",").map((x) => x.trim()).filter(Boolean),
    isAvailable: body.isAvailable !== false,
    stockStatus: STOCK_STATUSES.includes(body.stockStatus) ? body.stockStatus : "IN_STOCK",
    stockQuantity: Number(body.stockQuantity || 0),
    showStockToCustomers: body.showStockToCustomers !== false,
    isFeatured: Boolean(body.isFeatured)
  };
}

export async function GET() {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const query = user.role === ROLES.SUPER_ADMIN ? {} : { businessId: user.businessId };
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
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
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  if (user.role === ROLES.STAFF && !canStaff(user, "canEditProducts")) return json({ error: "Staff product editing is disabled." }, 403);
  const body = await request.json();
  if (!body.name) return json({ error: "Product name is required." }, 400);

  await connectDB();
  const business = await Business.findById(user.businessId);
  if (!business || !business.isActive) return json({ error: "Business unavailable." }, 403);
  const count = await Product.countDocuments({ businessId: business._id });
  if (count >= business.productLimit) return json({ error: "Product limit reached for this plan." }, 403);

  const productData = sanitize(body);
  if (productData.hasARModel) {
    const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
    if (arCount >= Number(business.arProductLimit || 0)) {
      return json({ error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
    }
  }

  const baseSlug = slugify(body.name);
  const exists = await Product.exists({ businessId: business._id, slug: baseSlug });
  const product = await Product.create({
    ...productData,
    businessId: business._id,
    slug: exists ? uniqueSlug(body.name, Date.now().toString()) : baseSlug
  });

  return json({ product: { ...product.toObject(), publicUrl: productPublicUrl(business.slug, product.slug) } }, 201);
}
