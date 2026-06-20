import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import { mb } from "@/lib/plans";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const fileSizeMB = mb(Number(body.fileSize || body.bytes || 0) / (1024 * 1024));
  if (!body.url || !body.publicId) {
    return NextResponse.json({ error: "Uploaded asset details are required." }, { status: 400 });
  }

  await connectDB();
  const business = user.businessId ? await Business.findById(user.businessId) : null;
  if (business && fileSizeMB > 0) {
    business.usedStorageMB = mb(Number(business.usedStorageMB || 0) + fileSizeMB);
    await business.save();
  }

  return NextResponse.json({
    url: body.url,
    publicId: body.publicId,
    fileSizeMB,
    uploadType: body.uploadType || "image"
  });
}
