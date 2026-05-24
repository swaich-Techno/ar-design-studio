import { clearSessionCookie, ensureEnvSuperAdmin, hashPassword, setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { trackEvent } from "@/lib/analytics";
import { uploadBuffer } from "@/lib/cloudinary";
import { campaignPublicUrl, cataloguePublicUrl, generateQrDataUrl, productPublicUrl, tablePublicUrl } from "@/lib/qr";
import { getPlanLimits, mb, planDefaults } from "@/lib/plans";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { DEFAULT_STAFF_PERMISSIONS, ROLES, canStaff } from "@/lib/permissions";
import Analytics from "@/models/Analytics";
import AuditLog from "@/models/AuditLog";
import Business from "@/models/Business";
import Campaign from "@/models/Campaign";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const analyticsEvents = new Set([
  "catalogue_view",
  "product_view",
  "ar_view",
  "whatsapp_click",
  "call_click",
  "location_click",
  "share_click",
  "table_scan",
  "campaign_view"
]);

function pathParts(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || url.pathname.replace(/^\/api\/?/, "");
  return path.split("/").map((part) => decodeURIComponent(part)).filter(Boolean);
}

function notFound() {
  return json({ error: "API route not found." }, 404);
}

function toList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function sanitizeProduct(body) {
  const hasARModel = Boolean(body.modelGlbUrl || body.modelUsdzUrl || body.hasARModel);
  return {
    name: body.name,
    category: body.category || "General",
    price: Number(body.price || 0),
    discountPrice: Number(body.discountPrice || 0),
    description: body.description || "",
    shortDescription: body.shortDescription || "",
    imageUrl: body.imageUrl || "",
    galleryImages: toList(body.galleryImages),
    fileSizeMB: mb(body.fileSizeMB || 0),
    modelGlbUrl: body.modelGlbUrl || "",
    modelUsdzUrl: body.modelUsdzUrl || "",
    modelFileSizeMB: mb(body.modelFileSizeMB || 0),
    hasARModel,
    offerText: body.offerText || "",
    tags: toList(body.tags),
    isAvailable: body.isAvailable !== false,
    isFeatured: Boolean(body.isFeatured)
  };
}

async function eventCount(query, eventType) {
  return Analytics.countDocuments({ ...query, eventType });
}

async function handleLogin(request) {
  try {
    const { email, password, role } = await request.json();
    const normalized = String(email || "").toLowerCase().trim();
    if (!normalized || !password || !role) return json({ error: "Email, password, and role are required." }, 400);
    await connectDB();
    const user = role === ROLES.SUPER_ADMIN
      ? await ensureEnvSuperAdmin(normalized)
      : await User.findOne({ email: normalized, role });
    if (!user || !user.isActive) return json({ error: "Invalid credentials." }, 401);
    if (!(await verifyPassword(password, user.passwordHash))) return json({ error: "Invalid credentials." }, 401);
    if (user.role !== role) return json({ error: "Use the correct login page for this account." }, 403);
    user.lastLoginAt = new Date();
    await user.save();
    if (user.role === ROLES.SUPER_ADMIN) {
      await writeAudit({ actor: user, action: "login", targetType: "User", targetId: String(user._id), description: "Super Admin logged in", request });
    }
    return setSessionCookie(json({ ok: true, role: user.role }), signSession(user));
  } catch (error) {
    return json({ error: error.message || "Login failed." }, 500);
  }
}

async function handleRegister(request) {
  try {
    const body = await request.json();
    for (const key of ["businessName", "ownerName", "email", "password", "whatsapp"]) {
      if (!body[key]) return json({ error: `${key} is required.` }, 400);
    }
    await connectDB();
    const email = String(body.email).toLowerCase().trim();
    if (await User.findOne({ email })) return json({ error: "An account with this email already exists." }, 409);
    let slug = slugify(body.businessName);
    if (await Business.exists({ slug })) slug = uniqueSlug(body.businessName, Date.now().toString());
    const business = await Business.create({
      businessName: body.businessName,
      ownerName: body.ownerName,
      email,
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      category: body.category || "Local shops",
      slug,
      ...planDefaults("Starter"),
      subscriptionStatus: "TRIAL",
      usedStorageMB: 0,
      isActive: true
    });
    const user = await User.create({
      name: body.ownerName,
      email,
      passwordHash: await hashPassword(body.password),
      role: ROLES.BUSINESS_OWNER,
      businessId: business._id,
      isActive: true
    });
    await generateQrDataUrl(cataloguePublicUrl(business.slug));
    return setSessionCookie(json({ ok: true, businessSlug: business.slug }), signSession(user));
  } catch (error) {
    return json({ error: error.message || "Registration failed." }, 500);
  }
}

async function handleTrack(request) {
  try {
    const body = await request.json();
    if (!analyticsEvents.has(body.eventType)) return json({ error: "Invalid event type." }, 400);
    await connectDB();
    const business = body.businessSlug ? await Business.findOne({ slug: body.businessSlug }).lean() : null;
    if (!business) return json({ ok: true });
    const product = body.productSlug ? await Product.findOne({ businessId: business._id, slug: body.productSlug }).lean() : null;
    const table = body.tableNumber ? await TableQR.findOne({ businessId: business._id, tableNumber: body.tableNumber }).lean() : null;
    const campaign = body.campaignSlug ? await Campaign.findOne({ businessId: business._id, slug: body.campaignSlug }).lean() : null;
    await trackEvent({ businessId: business._id, productId: product?._id, tableId: table?._id, campaignId: campaign?._id, eventType: body.eventType, request });
    return json({ ok: true });
  } catch {
    return json({ ok: true });
  }
}

async function handlePublicBusiness(businessSlug) {
  await connectDB();
  const business = await Business.findOne({ slug: businessSlug }).lean();
  if (!business) return json({ error: "Business not found." }, 404);
  if (!business.isActive) return json({ business: { businessName: business.businessName, logoUrl: business.logoUrl, slug: business.slug, isActive: false }, products: [] });
  const products = await Product.find({ businessId: business._id, isAvailable: true })
    .select("name slug category price discountPrice shortDescription imageUrl offerText isFeatured")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();
  return json({
    business: {
      businessName: business.businessName,
      logoUrl: business.logoUrl,
      coverImageUrl: business.coverImageUrl,
      phone: business.phone,
      whatsapp: business.whatsapp,
      address: business.address,
      mapLink: business.mapLink,
      instagram: business.instagram,
      category: business.category,
      slug: business.slug,
      isActive: business.isActive
    },
    products
  });
}

async function handlePublicProduct(businessSlug, productSlug) {
  await connectDB();
  const business = await Business.findOne({ slug: businessSlug }).lean();
  if (!business || !business.isActive) return json({ error: "Product unavailable." }, 404);
  const product = await Product.findOne({ businessId: business._id, slug: productSlug, isAvailable: true })
    .select("name slug category price discountPrice description shortDescription imageUrl galleryImages modelGlbUrl modelUsdzUrl offerText tags isAvailable")
    .lean();
  if (!product) return json({ error: "Product not found." }, 404);
  return json({
    business: {
      businessName: business.businessName,
      logoUrl: business.logoUrl,
      phone: business.phone,
      whatsapp: business.whatsapp,
      address: business.address,
      mapLink: business.mapLink,
      slug: business.slug
    },
    product
  });
}

async function handleDashboard() {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  if (user.role === ROLES.SUPER_ADMIN) {
    const [businesses, products, users, scans, recentBusinesses, recentAudit] = await Promise.all([
      Business.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Analytics.countDocuments(),
      Business.find().sort({ createdAt: -1 }).limit(6).lean(),
      AuditLog.find().sort({ createdAt: -1 }).limit(8).lean()
    ]);
    return json({ role: user.role, stats: { businesses, products, users, scans }, recentBusinesses, recentAudit });
  }
  const businessId = user.businessId;
  const [business, products, arProducts, tables, campaigns, scans, whatsapp, arViews, recentProducts, topProducts] = await Promise.all([
    Business.findById(businessId).lean(),
    Product.countDocuments({ businessId }),
    Product.countDocuments({ businessId, hasARModel: true }),
    TableQR.countDocuments({ businessId }),
    Campaign.countDocuments({ businessId }),
    Analytics.countDocuments({ businessId }),
    eventCount({ businessId }, "whatsapp_click"),
    eventCount({ businessId }, "ar_view"),
    Product.find({ businessId }).sort({ createdAt: -1 }).limit(5).lean(),
    Product.find({ businessId }).sort({ views: -1 }).limit(5).lean()
  ]);
  return json({
    role: user.role,
    business,
    stats: { products, arProducts, tables, campaigns, scans, whatsapp, arViews, usedStorageMB: business?.usedStorageMB || 0, storageLimitMB: business?.storageLimitMB || 0, arProductLimit: business?.arProductLimit || 0 },
    recentProducts,
    topProducts
  });
}

async function handleBusinessProfile(method, request) {
  const roles = method === "GET" ? [ROLES.BUSINESS_OWNER, ROLES.STAFF] : [ROLES.BUSINESS_OWNER];
  const { user, error } = await requireUser(roles);
  if (error) return error;
  await connectDB();
  if (method === "GET") return json({ business: await Business.findById(user.businessId).lean() });
  const body = await request.json();
  const allowed = ["businessName", "ownerName", "phone", "whatsapp", "logoUrl", "coverImageUrl", "address", "mapLink", "instagram", "category"];
  const update = {};
  for (const key of allowed) if (body[key] !== undefined) update[key] = body[key];
  if (body.businessName) update.slug = slugify(body.businessName);
  return json({ business: await Business.findByIdAndUpdate(user.businessId, update, { new: true }).lean() });
}

async function handleProducts(method, request, id) {
  if (!id && method === "GET") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    await connectDB();
    const query = user.role === ROLES.SUPER_ADMIN ? {} : { businessId: user.businessId };
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    const business = user.businessId ? await Business.findById(user.businessId).lean() : null;
    return json({ products: products.map((product) => ({ ...product, _id: String(product._id), businessId: String(product.businessId), publicUrl: business ? productPublicUrl(business.slug, product.slug) : "" })) });
  }
  if (!id && method === "POST") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    if (user.role === ROLES.STAFF && !canStaff(user, "canEditProducts")) return json({ error: "Staff product editing is disabled." }, 403);
    const body = await request.json();
    if (!body.name) return json({ error: "Product name is required." }, 400);
    await connectDB();
    const business = await Business.findById(user.businessId);
    if (!business || !business.isActive) return json({ error: "Business unavailable." }, 403);
    if (await Product.countDocuments({ businessId: business._id }) >= business.productLimit) return json({ error: "Product limit reached for this plan." }, 403);
    const productData = sanitizeProduct(body);
    if (productData.hasARModel) {
      const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
      if (arCount >= Number(business.arProductLimit || 0)) return json({ error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
    }
    const baseSlug = slugify(body.name);
    const exists = await Product.exists({ businessId: business._id, slug: baseSlug });
    const product = await Product.create({ ...productData, businessId: business._id, slug: exists ? uniqueSlug(body.name, Date.now().toString()) : baseSlug });
    return json({ product: { ...product.toObject(), publicUrl: productPublicUrl(business.slug, product.slug) } }, 201);
  }
  if (id && method === "GET") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return json({ error: "Product not found." }, 404);
    const denied = requireBusinessAccess(user, product.businessId);
    return denied || json({ product });
  }
  if (id && method === "PATCH") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    const body = await request.json();
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return json({ error: "Product not found." }, 404);
    const denied = requireBusinessAccess(user, product.businessId);
    if (denied) return denied;
    if (user.role === ROLES.STAFF) {
      if (body.isAvailable !== undefined && canStaff(user, "canEditAvailability")) product.isAvailable = Boolean(body.isAvailable);
      if (body.price !== undefined && canStaff(user, "canEditProducts")) product.price = Number(body.price || 0);
    } else {
      const wasARProduct = Boolean(product.hasARModel);
      const nextModelGlbUrl = body.modelGlbUrl !== undefined ? body.modelGlbUrl : product.modelGlbUrl;
      const nextModelUsdzUrl = body.modelUsdzUrl !== undefined ? body.modelUsdzUrl : product.modelUsdzUrl;
      const nextHasARModel = Boolean(nextModelGlbUrl || nextModelUsdzUrl || body.hasARModel);
      if (!wasARProduct && nextHasARModel) {
        const business = await Business.findById(product.businessId);
        const arCount = await Product.countDocuments({ businessId: product.businessId, hasARModel: true });
        if (arCount >= Number(business?.arProductLimit || 0)) return json({ error: `${business?.subscriptionPlan || "Starter"} includes ${business?.arProductLimit || 0} AR/3D products. Upgrade or buy an AR add-on to add this model.` }, 403);
      }
      for (const field of ["name", "category", "description", "shortDescription", "imageUrl", "modelGlbUrl", "modelUsdzUrl", "offerText"]) if (body[field] !== undefined) product[field] = body[field];
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
  if (id && method === "DELETE") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
    if (error) return error;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return json({ error: "Product not found." }, 404);
    const denied = requireBusinessAccess(user, product.businessId);
    if (denied) return denied;
    await product.deleteOne();
    if (user.role === ROLES.SUPER_ADMIN) await writeAudit({ actor: user, action: "product deleted", targetType: "Product", targetId: id, description: product.name, request });
    return json({ ok: true });
  }
  return notFound();
}

async function handleTables(method, request, id) {
  if (!id && method === "GET") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    await connectDB();
    return json({ tables: await TableQR.find({ businessId: user.businessId }).sort({ tableNumber: 1 }).lean() });
  }
  if (!id && method === "POST") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
    if (error) return error;
    const body = await request.json();
    if (!body.tableNumber) return json({ error: "Table number is required." }, 400);
    await connectDB();
    const business = await Business.findById(user.businessId);
    const publicUrl = tablePublicUrl(business.slug, body.tableNumber);
    const table = await TableQR.findOneAndUpdate(
      { businessId: business._id, tableNumber: String(body.tableNumber) },
      { tableName: body.tableName || "", publicUrl, qrCodeDataUrl: await generateQrDataUrl(publicUrl), isActive: body.isActive !== false },
      { upsert: true, new: true }
    );
    return json({ table }, 201);
  }
  if (id && (method === "PATCH" || method === "DELETE")) {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
    if (error) return error;
    await connectDB();
    const table = await TableQR.findById(id);
    if (!table) return json({ error: "Table QR not found." }, 404);
    const denied = requireBusinessAccess(user, table.businessId);
    if (denied) return denied;
    if (method === "DELETE") {
      await table.deleteOne();
      return json({ ok: true });
    }
    const body = await request.json();
    if (body.tableName !== undefined) table.tableName = body.tableName;
    if (body.isActive !== undefined) table.isActive = Boolean(body.isActive);
    await table.save();
    return json({ table });
  }
  return notFound();
}

async function handleCampaigns(method, request, id) {
  if (!id && method === "GET") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
    if (error) return error;
    await connectDB();
    const business = await Business.findById(user.businessId).lean();
    const campaigns = await Campaign.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean();
    return json({ campaigns: campaigns.map((campaign) => ({ ...campaign, publicUrl: business ? campaignPublicUrl(business.slug, campaign.slug) : "" })) });
  }
  if (!id && method === "POST") {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
    if (error) return error;
    const body = await request.json();
    if (!body.title) return json({ error: "Campaign title is required." }, 400);
    await connectDB();
    const business = await Business.findById(user.businessId);
    const baseSlug = slugify(body.title);
    const exists = await Campaign.exists({ businessId: business._id, slug: baseSlug });
    const slug = exists ? uniqueSlug(body.title, Date.now().toString()) : baseSlug;
    const publicUrl = campaignPublicUrl(business.slug, slug);
    const campaign = await Campaign.create({
      businessId: business._id,
      title: body.title,
      slug,
      description: body.description || "",
      offerText: body.offerText || "",
      bannerImageUrl: body.bannerImageUrl || "",
      selectedProductIds: body.selectedProductIds || [],
      startDate: body.startDate || undefined,
      endDate: body.endDate || undefined,
      qrCodeDataUrl: await generateQrDataUrl(publicUrl),
      isActive: body.isActive !== false
    });
    return json({ campaign, publicUrl }, 201);
  }
  if (id && (method === "PATCH" || method === "DELETE")) {
    const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
    if (error) return error;
    await connectDB();
    const campaign = await Campaign.findById(id);
    if (!campaign) return json({ error: "Campaign not found." }, 404);
    const denied = requireBusinessAccess(user, campaign.businessId);
    if (denied) return denied;
    if (method === "DELETE") {
      await campaign.deleteOne();
      return json({ ok: true });
    }
    const body = await request.json();
    for (const field of ["title", "description", "offerText", "bannerImageUrl", "startDate", "endDate", "isActive"]) if (body[field] !== undefined) campaign[field] = body[field];
    if (body.selectedProductIds !== undefined) campaign.selectedProductIds = body.selectedProductIds;
    await campaign.save();
    return json({ campaign });
  }
  return notFound();
}

async function handleStaff(method, request, id) {
  if (!id && method === "GET") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
    if (error) return error;
    await connectDB();
    const query = user.role === ROLES.SUPER_ADMIN ? { role: ROLES.STAFF } : { role: ROLES.STAFF, businessId: user.businessId };
    return json({ staff: await User.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean() });
  }
  if (!id && method === "POST") {
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
    if (await User.exists({ email })) return json({ error: "Email already exists." }, 409);
    const staff = await User.create({ name: body.name, email, passwordHash: await hashPassword(body.password), role: ROLES.STAFF, businessId, permissions: { ...DEFAULT_STAFF_PERMISSIONS, ...(body.permissions || {}) }, isActive: true });
    const safe = staff.toObject();
    delete safe.passwordHash;
    return json({ staff: safe }, 201);
  }
  if (id && method === "PATCH") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER]);
    if (error) return error;
    const body = await request.json();
    await connectDB();
    const staff = await User.findById(id);
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
  return notFound();
}

async function handleQrs() {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  const [products, tables, campaigns] = await Promise.all([
    Product.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean(),
    TableQR.find({ businessId: user.businessId }).sort({ tableNumber: 1 }).lean(),
    Campaign.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean()
  ]);
  const catalogueUrl = cataloguePublicUrl(business.slug);
  return json({
    catalogue: { label: `${business.businessName} catalogue`, publicUrl: catalogueUrl, qrCodeDataUrl: await generateQrDataUrl(catalogueUrl) },
    products: await Promise.all(products.map(async (product) => {
      const publicUrl = productPublicUrl(business.slug, product.slug);
      return { id: product._id, label: product.name, publicUrl, qrCodeDataUrl: await generateQrDataUrl(publicUrl) };
    })),
    tables: tables.map((table) => ({ id: table._id, label: table.tableName || `Table ${table.tableNumber}`, publicUrl: table.publicUrl || tablePublicUrl(business.slug, table.tableNumber), qrCodeDataUrl: table.qrCodeDataUrl })),
    campaigns: campaigns.map((campaign) => ({ id: campaign._id, label: campaign.title, publicUrl: campaignPublicUrl(business.slug, campaign.slug), qrCodeDataUrl: campaign.qrCodeDataUrl }))
  });
}

async function handleUpload(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  const form = await request.formData();
  const file = form.get("file");
  const folder = form.get("folder") || "ar-design-studio";
  const uploadType = String(form.get("uploadType") || "image");
  const productId = form.get("productId");
  if (!file) return json({ error: "File is required." }, 400);
  await connectDB();
  const business = user.businessId ? await Business.findById(user.businessId) : null;
  const sizeMB = mb(Number(file.size || 0) / (1024 * 1024));
  const limits = getPlanLimits(business?.subscriptionPlan);
  if (business) {
    const remainingStorage = Math.max(0, Number(business.storageLimitMB || 0) - Number(business.usedStorageMB || 0));
    if (sizeMB > remainingStorage) return json({ error: `Storage limit reached. ${business.subscriptionPlan} has ${business.storageLimitMB} MB storage. Upgrade or add storage to upload more files.` }, 403);
  }
  if (uploadType === "image" && sizeMB > limits.imageMaxSizeMB) return json({ error: `${business?.subscriptionPlan || "Starter"} image upload limit is ${limits.imageMaxSizeMB} MB. Compress the image or upgrade the plan.` }, 413);
  if (uploadType === "model") {
    const lower = String(file.name || "").toLowerCase();
    if (!lower.endsWith(".glb") && !lower.endsWith(".usdz")) return json({ error: "Only .glb and .usdz model files are allowed." }, 400);
    if (!business) return json({ error: "Model uploads must be linked to a business plan." }, 403);
    const currentProduct = productId ? await Product.findOne({ _id: productId, businessId: business._id }).select("hasARModel") : null;
    const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
    if (arCount >= Number(business.arProductLimit || 0) && !currentProduct?.hasARModel) return json({ error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to upload more models.` }, 403);
  }
  let result;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    result = await uploadBuffer(buffer, { folder: String(folder), resourceType: uploadType === "model" ? "raw" : "image", fileName: String(file.name || "upload") });
  } catch (error) {
    return json({ error: error.message || "Upload failed." }, 500);
  }
  if (business) {
    business.usedStorageMB = mb(Number(business.usedStorageMB || 0) + sizeMB);
    await business.save();
  }
  return json({ url: result.secureUrl, publicId: result.publicId, fileSizeMB: sizeMB, uploadType });
}

async function handleAdminBusinesses(method, request, id) {
  if (!id && method === "GET") {
    const { error } = await requireUser([ROLES.SUPER_ADMIN]);
    if (error) return error;
    await connectDB();
    const businesses = await Business.find().sort({ createdAt: -1 }).lean();
    const usage = await Product.aggregate([{ $group: { _id: "$businessId", productCount: { $sum: 1 }, arProductCount: { $sum: { $cond: ["$hasARModel", 1, 0] } } } }]);
    const usageMap = new Map(usage.map((item) => [String(item._id), item]));
    return json({ businesses: businesses.map((business) => ({ ...business, productCount: usageMap.get(String(business._id))?.productCount || 0, arProductCount: usageMap.get(String(business._id))?.arProductCount || 0 })) });
  }
  if (!id && method === "POST") {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN]);
    if (error) return error;
    const body = await request.json();
    if (!body.businessName || !body.ownerName || !body.email || !body.password) return json({ error: "Business name, owner, email, and password are required." }, 400);
    await connectDB();
    const email = String(body.email).toLowerCase().trim();
    if (await User.exists({ email })) return json({ error: "Owner email already exists." }, 409);
    let slug = slugify(body.businessName);
    if (await Business.exists({ slug })) slug = uniqueSlug(body.businessName, Date.now().toString());
    const defaults = planDefaults(body.subscriptionPlan || "Starter");
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
    await User.create({ name: body.ownerName, email, passwordHash: await hashPassword(body.password), role: ROLES.BUSINESS_OWNER, businessId: business._id, isActive: true });
    await writeAudit({ actor: user, action: "business created", targetType: "Business", targetId: String(business._id), description: business.businessName, request });
    return json({ business }, 201);
  }
  if (id && (method === "PATCH" || method === "DELETE")) {
    const { user, error } = await requireUser([ROLES.SUPER_ADMIN]);
    if (error) return error;
    await connectDB();
    if (method === "DELETE") {
      const business = await Business.findByIdAndDelete(id);
      if (!business) return json({ error: "Business not found." }, 404);
      await writeAudit({ actor: user, action: "business deleted", targetType: "Business", targetId: id, description: business.businessName, request });
      return json({ ok: true });
    }
    const body = await request.json();
    const updates = {};
    for (const field of ["businessName", "ownerName", "email", "phone", "whatsapp", "category", "subscriptionStatus"]) if (body[field] !== undefined) updates[field] = body[field];
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.subscriptionPlan !== undefined) Object.assign(updates, planDefaults(body.subscriptionPlan));
    for (const field of ["productLimit", "staffLimit", "storageLimitMB", "arProductLimit", "usedStorageMB"]) if (body[field] !== undefined) updates[field] = Number(body[field] || 0);
    const business = await Business.findByIdAndUpdate(id, updates, { new: true });
    if (!business) return json({ error: "Business not found." }, 404);
    await writeAudit({ actor: user, action: body.subscriptionPlan ? "subscription changed" : body.isActive === false ? "business deactivated" : "business updated", targetType: "Business", targetId: id, description: business.businessName, request });
    return json({ business });
  }
  return notFound();
}

async function dispatch(request, method) {
  const parts = pathParts(request);
  if (parts[0] === "auth" && parts[1] === "login" && method === "POST") return handleLogin(request);
  if (parts[0] === "auth" && parts[1] === "logout" && method === "POST") return clearSessionCookie();
  if (parts[0] === "auth" && parts[1] === "me" && method === "GET") {
    const { user, error } = await requireUser();
    if (error) return json({ user: null }, 401);
    return json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, businessId: user.businessId, permissions: user.permissions } });
  }
  if (parts[0] === "auth" && parts[1] === "register" && method === "POST") return handleRegister(request);
  if (parts[0] === "auth") return json({ ok: true });
  if (parts[0] === "analytics" && parts[1] === "track" && method === "POST") return handleTrack(request);
  if (parts[0] === "public" && parts[1] === "business" && method === "GET") return handlePublicBusiness(parts[2]);
  if (parts[0] === "public" && parts[1] === "product" && method === "GET") return handlePublicProduct(parts[2], parts[3]);
  if (parts[0] === "dashboard" && method === "GET") return handleDashboard();
  if (parts[0] === "business" && parts[1] === "profile" && ["GET", "PATCH"].includes(method)) return handleBusinessProfile(method, request);
  if (parts[0] === "products") return handleProducts(method, request, parts[1]);
  if (parts[0] === "tables") return handleTables(method, request, parts[1]);
  if (parts[0] === "campaigns") return handleCampaigns(method, request, parts[1]);
  if (parts[0] === "staff") return handleStaff(method, request, parts[1]);
  if (parts[0] === "qrs" && method === "GET") return handleQrs();
  if (parts[0] === "upload" && method === "POST") return handleUpload(request);
  if (parts[0] === "admin" && parts[1] === "businesses") return handleAdminBusinesses(method, request, parts[2]);
  return notFound();
}

export async function GET(request) {
  return dispatch(request, "GET");
}

export async function POST(request) {
  return dispatch(request, "POST");
}

export async function PATCH(request) {
  return dispatch(request, "PATCH");
}

export async function DELETE(request) {
  return dispatch(request, "DELETE");
}
