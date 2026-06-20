import { NextResponse } from "next/server";
import { getCloudinaryDirectUpload } from "@/lib/cloudinary";
import { requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { resolveUploadPolicy } from "@/lib/uploadPolicy";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const uploadType = String(body.uploadType || "image");
  const policy = await resolveUploadPolicy({
    user,
    fileName: String(body.fileName || "upload"),
    fileSizeBytes: Number(body.fileSize || 0),
    uploadType,
    productId: body.productId,
    folder: body.folder || "ar-design-studio"
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
