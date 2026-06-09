import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { hashPassword, setSessionCookie, signSession } from "@/lib/auth";
import { cataloguePublicUrl, generateQrDataUrl } from "@/lib/qr";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { planDefaults } from "@/lib/plans";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ["businessName", "ownerName", "email", "password", "whatsapp"];
    for (const key of required) {
      if (!body[key]) return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
    }

    await connectDB();
    const email = String(body.email).toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const baseSlug = slugify(body.businessName);
    let slug = baseSlug;
    const exists = await Business.exists({ slug });
    if (exists) slug = uniqueSlug(body.businessName, Date.now().toString());

    const starterDefaults = planDefaults("Starter");
    const business = await Business.create({
      businessName: body.businessName,
      ownerName: body.ownerName,
      email,
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      category: body.category || "Local shops",
      slug,
      ...starterDefaults,
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
    const token = signSession(user);
    return setSessionCookie(NextResponse.json({ ok: true, businessSlug: business.slug }), token);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}
