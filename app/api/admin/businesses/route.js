import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { json, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { planDefaults } from "@/lib/plans";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  const { error } = await requireUser([ROLES.SUPER_ADMIN]);
  if (error) return error;
  await connectDB();
  const businesses = await Business.find().sort({ createdAt: -1 }).lean();
  const usage = await Product.aggregate([
    { $group: { _id: "$businessId", productCount: { $sum: 1 }, arProductCount: { $sum: { $cond: ["$hasARModel", 1, 0] } } } }
  ]);
  const usageMap = new Map(usage.map((item) => [String(item._id), item]));
  return json({
    businesses: businesses.map((business) => ({
      ...business,
      productCount: usageMap.get(String(business._id))?.productCount || 0,
      arProductCount: usageMap.get(String(business._id))?.arProductCount || 0
    }))
  });
}

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN]);
  if (error) return error;
  const body = await request.json();
  if (!body.businessName || !body.ownerName || !body.email || !body.password) {
    return json({ error: "Business name, owner, email, and password are required." }, 400);
  }
  await connectDB();
  const email = String(body.email).toLowerCase().trim();
  if (await User.exists({ email })) return json({ error: "Owner email already exists." }, 409);
  let slug = slugify(body.businessName);
  if (await Business.exists({ slug })) slug = uniqueSlug(body.businessName, Date.now().toString());
  const plan = body.subscriptionPlan || "Starter";
  const defaults = planDefaults(plan);
  const business = await Business.create({
    businessName: body.businessName,
    ownerName: body.ownerName,
    email,
    phone: body.phone || "",
    whatsapp: body.whatsapp || "",
    category: body.category || "Local shops",
    slug,
    ...defaults,
    subscriptionStatus: body.subscriptionStatus || "ACTIVE",
    productLimit: Number(body.productLimit || defaults.productLimit),
    staffLimit: Number(body.staffLimit || defaults.staffLimit),
    storageLimitMB: Number(body.storageLimitMB || defaults.storageLimitMB),
    arProductLimit: Number(body.arProductLimit || defaults.arProductLimit),
    usedStorageMB: 0,
    isActive: true
  });
  await User.create({
    name: body.ownerName,
    email,
    passwordHash: await hashPassword(body.password),
    role: ROLES.BUSINESS_OWNER,
    businessId: business._id,
    isActive: true
  });
  await writeAudit({ actor: user, action: "business created", targetType: "Business", targetId: String(business._id), description: business.businessName, request });
  return json({ business }, 201);
}
