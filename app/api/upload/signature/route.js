import { NextResponse } from "next/server";
import { getCloudinaryDirectUpload } from "@/lib/cloudinary";
import { requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { LIMITS, clientIp, rateLimit, tooMany } from "@/lib/rateLimit";
import { resolveUploadPolicy } from "@/lib/uploadPolicy";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER, ROLES.BUSINESS_STAFF, ROLES.STAFF]);
  if (error) return error;
  const limited = rateLimit(`upload:${user._id || clientIp(request)}`, LIMITS.upload);
  if (!limited.ok) {
    const fail = tooMany(limited.retryAfterSec);
    return NextResponse.json(fail.body, { status: fail.status, headers: fail.headers });
  }

  const body = await request.json().catch(() => ({}));
  const uploadType = String(body.uploadType || "image");
  const policy = await resolveUploadPolicy({
    user,
    fileName: String(body.fileName || "upload"),
    fileSizeBytes: Number(body.fileSize || 0),
    uploadType,
    productId: body.productId,
    folder: body.folder || "ar-design-studio",
    mimeType: body.mimeType
  });
  if (policy.error) return NextResponse.json({ error: policy.error }, { status: policy.status });

  try {
    const direct = getCloudinaryDirectUpload({
      folder: policy.folder,
      resourceType: policy.resourceType,
      publicId: policy.publicId,
      fileName: String(body.fileName || "upload")
    });
    return NextResponse.json({
      ...direct,
      fileSizeMB: policy.fileSizeMB,
      publicId: policy.publicId,
      resourceType: policy.resourceType,
      uploadType
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Direct upload is unavailable." }, { status: 503 });
  }
}
