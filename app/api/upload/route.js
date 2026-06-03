import { NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import { getPlanLimits, mb } from "@/lib/plans";
import Business from "@/models/Business";
import Product from "@/models/Product";

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  const form = await request.formData();
  const file = form.get("file");
  const folder = form.get("folder") || "ar-design-studio";
  const uploadType = String(form.get("uploadType") || "image");
  const productId = form.get("productId");
  if (!file) return NextResponse.json({ error: "File is required." }, { status: 400 });

  await connectDB();
  const business = user.businessId ? await Business.findById(user.businessId) : null;
  const sizeMB = mb(Number(file.size || 0) / (1024 * 1024));
  const limits = getPlanLimits(business?.subscriptionPlan);

  if (business) {
    const remainingStorage = Math.max(0, Number(business.storageLimitMB || 0) - Number(business.usedStorageMB || 0));
    if (sizeMB > remainingStorage) {
      return NextResponse.json(
        { error: `Storage limit reached. ${business.subscriptionPlan} has ${business.storageLimitMB} MB storage. Upgrade or add storage to upload more files.` },
        { status: 403 }
      );
    }
  }

  if (uploadType === "image" && sizeMB > limits.imageMaxSizeMB) {
    return NextResponse.json(
      { error: `${business?.subscriptionPlan || "Starter"} image upload limit is ${limits.imageMaxSizeMB} MB. Compress the image or upgrade the plan.` },
      { status: 413 }
    );
  }

  if (uploadType === "model") {
    const lower = String(file.name || "").toLowerCase();
    if (!lower.endsWith(".glb") && !lower.endsWith(".usdz")) {
      return NextResponse.json({ error: "Only .glb and .usdz model files are allowed." }, { status: 400 });
    }
    if (!business) {
      return NextResponse.json({ error: "Model uploads must be linked to a business plan." }, { status: 403 });
    }
    const currentProduct = productId ? await Product.findOne({ _id: productId, businessId: business._id }).select("hasARModel") : null;
    const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
    if (arCount >= Number(business.arProductLimit || 0)) {
      if (!currentProduct?.hasARModel) {
        return NextResponse.json(
          { error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to upload more models.` },
          { status: 403 }
        );
      }
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let result;
  try {
    result = await uploadBuffer(buffer, {
      folder: String(folder),
      resourceType: uploadType === "model" ? "raw" : "image",
      fileName: String(file.name || "upload")
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed." }, { status: 500 });
  }

  if (business) {
    business.usedStorageMB = mb(Number(business.usedStorageMB || 0) + sizeMB);
    await business.save();
  }

  return NextResponse.json({ url: result.secureUrl, publicId: result.publicId, fileSizeMB: sizeMB, uploadType });
}
