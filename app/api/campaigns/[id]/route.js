import { connectDB } from "@/lib/mongodb";
import { json, requireBusinessAccess, requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import Campaign from "@/models/Campaign";

export async function PATCH(request, { params }) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  await connectDB();
  const campaign = await Campaign.findById(params.id);
  if (!campaign) return json({ error: "Campaign not found." }, 404);
  const denied = requireBusinessAccess(user, campaign.businessId);
  if (denied) return denied;
  const fields = ["title", "description", "offerText", "bannerImageUrl", "startDate", "endDate", "isActive"];
  for (const field of fields) if (body[field] !== undefined) campaign[field] = body[field];
  if (body.selectedProductIds !== undefined) campaign.selectedProductIds = body.selectedProductIds;
  await campaign.save();
  return json({ campaign });
}

export async function DELETE(_request, { params }) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  await connectDB();
  const campaign = await Campaign.findById(params.id);
  if (!campaign) return json({ error: "Campaign not found." }, 404);
  const denied = requireBusinessAccess(user, campaign.businessId);
  if (denied) return denied;
  await campaign.deleteOne();
  return json({ ok: true });
}
