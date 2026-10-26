import { NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/cloudinary";
import { requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { mb } from "@/lib/plans";
import { LIMITS, clientIp, rateLimit, tooMany } from "@/lib/rateLimit";
import { resolveUploadPolicy } from "@/lib/uploadPolicy";
import { validateUploadBuffer } from "@/lib/uploadValidate";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER, ROLES.BUSINESS_OWNER, ROLES.BUSINESS_MANAGER, ROLES.BUSINESS_STAFF, ROLES.STAFF]);
  if (error) return error;
  const limited = rateLimit(`upload:${user._id || clientIp(request)}`, LIMITS.upload);
  if (!limited.ok) {
    const fail = tooMany(limited.retryAfterSec);
    return NextResponse.json(fail.body, { status: fail.status, headers: fail.headers });
  }
  const form = await request.formData();
  const file = form.get("file");
  const folder = form.get("folder") || "ar-design-studio";
  const uploadType = String(form.get("uploadType") || "image");
  const productId = form.get("productId");
  if (!file) return NextResponse.json({ error: "File is required." }, { status: 400 });

  const policy = await resolveUploadPolicy({
    user,
    fileName: String(file.name || "upload"),
    fileSizeBytes: Number(file.size || 0),
    uploadType,
    productId,
    folder,
    mimeType: file.type
  });
  if (policy.error) return NextResponse.json({ error: policy.error }, { status: policy.status });

  const buffer = Buffer.from(await file.arrayBuffer());
  const contents = validateUploadBuffer(buffer, uploadType);
  if (contents.error) return NextResponse.json({ error: contents.error }, { status: contents.status });
  let result;
  try {
    result = await uploadBuffer(buffer, {
      folder: policy.folder,
      resourceType: policy.resourceType,
      fileName: String(file.name || "upload"),
      publicId: policy.publicId
    });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  if (policy.business) {
    policy.business.usedStorageMB = mb(Number(policy.business.usedStorageMB || 0) + policy.fileSizeMB);
    await policy.business.save();
  }

  return NextResponse.json({ url: result.secureUrl, publicId: result.publicId, fileSizeMB: policy.fileSizeMB, uploadType });
}
