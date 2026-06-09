import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { campaignPublicUrl, generateQrDataUrl } from "@/lib/qr";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import Campaign from "@/models/Campaign";

export async function GET() {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  const campaigns = await Campaign.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean();
  return json({ campaigns: campaigns.map((campaign) => ({ ...campaign, publicUrl: business ? campaignPublicUrl(business.slug, campaign.slug) : "" })) });
}

export async function POST(request) {
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
