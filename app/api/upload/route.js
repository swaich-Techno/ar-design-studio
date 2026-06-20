import { NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/cloudinary";
import { requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { mb } from "@/lib/plans";
import { resolveUploadPolicy } from "@/lib/uploadPolicy";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
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
    folder
  });
  if (policy.error) return NextResponse.json({ error: policy.error }, { status: policy.status });

  const buffer = Buffer.from(await file.arrayBuffer());
  let result;
  try {
    result = await uploadBuffer(buffer, {
      folder: policy.folder,
      resourceType: policy.resourceType,
      fileName: String(file.name || "upload"),
      publicId: policy.publicId
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed." }, { status: 500 });
  }

  if (policy.business) {
    policy.business.usedStorageMB = mb(Number(policy.business.usedStorageMB || 0) + policy.fileSizeMB);
    await policy.business.save();
  }

  return NextResponse.json({ url: result.secureUrl, publicId: result.publicId, fileSizeMB: policy.fileSizeMB, uploadType });
}
