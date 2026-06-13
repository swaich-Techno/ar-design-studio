import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { json, requireUser } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { ROLES, canApproveContent } from "@/lib/permissions";
import Business from "@/models/Business";
import SupportTicket from "@/models/SupportTicket";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const DEMO_DAYS = 14;

function appendNote(existing, next) {
  return [existing, `[${new Date().toISOString()}] ${next}`].filter(Boolean).join("\n");
}

function temporaryPassword() {
  return `${randomBytes(6).toString("base64url")}A1!`;
}

async function uniqueBusinessSlug(name) {
  const base = slugify(name) || "demo-client";
  if (!(await Business.exists({ slug: base }))) return base;
  return uniqueSlug(base, Date.now().toString());
}

function demoExpiry() {
  const date = new Date();
  date.setDate(date.getDate() + DEMO_DAYS);
  return date;
}

function publicTicket(ticket) {
  return {
    ...ticket,
    _id: String(ticket._id),
    businessId: ticket.businessId ? String(ticket.businessId) : "",
    demoBusinessId: ticket.demoBusinessId || null,
    demoOwnerUserId: ticket.demoOwnerUserId || null
  };
}

export async function GET() {
  const { error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.SUPPORT_STAFF]);
  if (error) return error;
  await connectDB();
  const requests = await SupportTicket.find({ ticketType: "DEMO_REQUEST" })
    .populate("demoBusinessId", "businessName slug email subscriptionStatus productLimit arProductLimit demoExpiresAt")
    .populate("demoOwnerUserId", "name email role")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return json({ requests: requests.map(publicTicket) });
}

export async function PATCH(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER]);
  if (error) return error;
  if (!canApproveContent(user)) return json({ error: "Demo approval access denied." }, 403);

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "").toLowerCase();
  if (!body.ticketId || !["approve", "reject"].includes(action)) {
    return json({ error: "ticketId and action approve/reject are required." }, 400);
  }

  await connectDB();
  const ticket = await SupportTicket.findOne({ _id: body.ticketId, ticketType: "DEMO_REQUEST" });
  if (!ticket) return json({ error: "Demo request not found." }, 404);

  if (action === "reject") {
    ticket.demoStatus = "REJECTED";
    ticket.status = "CLOSED";
    ticket.notes = appendNote(ticket.notes, body.notes || "Demo request rejected.");
    await ticket.save();
    await writeAudit({ actor: user, action: "demo request rejected", targetType: "SupportTicket", targetId: String(ticket._id), description: ticket.title, request });
    return json({ request: ticket });
  }

  const email = String(ticket.requesterEmail || "").toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return json({ error: "This demo request needs a valid email before it can be approved." }, 400);
  }

  const ownerName = ticket.requesterName || "Demo Client";
  const businessName = ticket.requesterBusinessName || `${ownerName} Demo`;
  const now = new Date();
  const expiresAt = demoExpiry();

  let business = await Business.findOne({ email });
  if (!business) {
    business = await Business.create({
      businessName,
      ownerName,
      email,
      phone: ticket.requesterPhone || "",
      whatsapp: ticket.requesterPhone || "",
      category: ticket.requesterIndustry || "Local shops",
      slug: await uniqueBusinessSlug(businessName),
      subscriptionPlan: "Starter",
      subscriptionStatus: "TRIAL",
      setupFee: 0,
      monthlyFee: 0,
      productLimit: 1,
      staffLimit: 1,
      storageLimitMB: 250,
      arProductLimit: 1,
      usedStorageMB: 0,
      isFreeDemoApproved: true,
      demoProductLimit: 1,
      demoArProductLimit: 1,
      demoSourceTicketId: ticket._id,
      demoApprovedBy: user._id,
      demoApprovedAt: now,
      demoExpiresAt: expiresAt,
      isActive: true
    });
  } else {
    business.productLimit = Math.max(Number(business.productLimit || 0), 1);
    business.arProductLimit = Math.max(Number(business.arProductLimit || 0), 1);
    business.storageLimitMB = Math.max(Number(business.storageLimitMB || 0), 250);
    business.staffLimit = Math.max(Number(business.staffLimit || 0), 1);
    business.subscriptionStatus = business.subscriptionStatus === "ACTIVE" ? business.subscriptionStatus : "TRIAL";
    business.isActive = true;
    business.isFreeDemoApproved = true;
    business.demoProductLimit = 1;
    business.demoArProductLimit = 1;
    business.demoSourceTicketId = ticket._id;
    business.demoApprovedBy = user._id;
    business.demoApprovedAt = now;
    business.demoExpiresAt = expiresAt;
    await business.save();
  }

  let owner = await User.findOne({ email });
  let generatedPassword = "";
  if (owner && owner.businessId && String(owner.businessId) !== String(business._id)) {
    return json({ error: "This email already belongs to another business owner. Use a different client email or merge the account manually." }, 409);
  }
  if (owner && ![ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER].includes(owner.role)) {
    return json({ error: "This email already belongs to an internal or staff user. Use a different client email." }, 409);
  }
  if (!owner) {
    generatedPassword = temporaryPassword();
    owner = await User.create({
      name: ownerName,
      email,
      passwordHash: await hashPassword(generatedPassword),
      role: ROLES.BUSINESS_OWNER,
      businessId: business._id,
      isActive: true
    });
  } else if (!owner.businessId) {
    owner.businessId = business._id;
    owner.isActive = true;
    await owner.save();
  }

  ticket.businessId = business._id;
  ticket.demoBusinessId = business._id;
  ticket.demoOwnerUserId = owner._id;
  ticket.demoApprovedBy = user._id;
  ticket.demoApprovedAt = now;
  ticket.demoStatus = "APPROVED";
  ticket.status = "IN_PROGRESS";
  ticket.notes = appendNote(ticket.notes, `Approved one-product demo workspace /b/${business.slug}.`);
  await ticket.save();

  await writeAudit({ actor: user, action: "demo request approved", targetType: "Business", targetId: String(business._id), description: `${business.businessName} one-product demo approved`, request });

  return json({
    request: ticket,
    business: {
      id: String(business._id),
      businessName: business.businessName,
      slug: business.slug,
      publicUrl: `/b/${business.slug}`,
      productLimit: business.productLimit,
      arProductLimit: business.arProductLimit,
      demoExpiresAt: business.demoExpiresAt
    },
    owner: {
      id: String(owner._id),
      email: owner.email,
      temporaryPassword: generatedPassword
    }
  });
}
