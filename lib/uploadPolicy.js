import { connectDB } from "@/lib/mongodb";
import { getPlanLimits, mb } from "@/lib/plans";
import Business from "@/models/Business";
import Product from "@/models/Product";

export const MODEL_EXTENSIONS = [".glb", ".usdz"];
export const MODEL_MAX_SIZE_MB = 100;

export function safeFolderPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function fileExtension(fileName = "") {
  const match = String(fileName).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

export function isModelFile(fileName = "") {
  return MODEL_EXTENSIONS.includes(fileExtension(fileName));
}

export function uploadResourceType(uploadType = "image") {
  return uploadType === "model" ? "raw" : "image";
}

export function uploadFolder(folder, business, uploadType = "image") {
  const requested = safeFolderPart(String(folder || "").split("/").pop()) || "uploads";
  const owner = business?.slug ? `clients/${safeFolderPart(business.slug)}` : "platform";
  const kind = uploadType === "model" ? "models" : "images";
  return `ar-design-studio/${owner}/${kind}/${requested}`;
}

export function uploadPublicId(fileName = "upload", uploadType = "image") {
  const extension = fileExtension(fileName);
  const cleanName = safeFolderPart(String(fileName || "upload").replace(/\.[a-z0-9]+$/i, "")) || "upload";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return uploadType === "model" ? `${cleanName}-${suffix}${extension}` : `${cleanName}-${suffix}`;
}

export async function resolveUploadPolicy({ user, fileName, fileSizeBytes = 0, uploadType = "image", productId, folder }) {
  await connectDB();
  const business = user.businessId ? await Business.findById(user.businessId) : null;
  const sizeMB = mb(Number(fileSizeBytes || 0) / (1024 * 1024));
  const limits = getPlanLimits(business?.subscriptionPlan);

  if (business) {
    const remainingStorage = Math.max(0, Number(business.storageLimitMB || 0) - Number(business.usedStorageMB || 0));
    if (sizeMB > remainingStorage) {
      return {
        error: `Storage limit reached. ${business.subscriptionPlan} has ${business.storageLimitMB} MB storage. Upgrade or add storage to upload more files.`,
        status: 403
      };
    }
  }

  if (uploadType === "image" && sizeMB > limits.imageMaxSizeMB) {
    return {
      error: `${business?.subscriptionPlan || "Starter"} image upload limit is ${limits.imageMaxSizeMB} MB. Compress the image or upgrade the plan.`,
      status: 413
    };
  }

  if (uploadType === "model") {
    if (!isModelFile(fileName)) {
      return { error: "Only .glb and .usdz model files are allowed.", status: 400 };
    }
    if (!business) {
      return { error: "Model uploads must be linked to a business plan.", status: 403 };
    }
    if (sizeMB > MODEL_MAX_SIZE_MB) {
      return {
        error: `Model upload limit is ${MODEL_MAX_SIZE_MB} MB per file. Compress textures, export a smaller GLB/USDZ, or paste a hosted model URL.`,
        status: 413
      };
    }
    const currentProduct = productId ? await Product.findOne({ _id: productId, businessId: business._id }).select("hasARModel") : null;
    const arCount = await Product.countDocuments({ businessId: business._id, hasARModel: true });
    if (arCount >= Number(business.arProductLimit || 0) && !currentProduct?.hasARModel) {
      return {
        error: `${business.subscriptionPlan} includes ${business.arProductLimit} AR/3D products. Upgrade or buy an AR add-on to upload more models.`,
        status: 403
      };
    }
  }

  return {
    business,
    fileSizeMB: sizeMB,
    folder: uploadFolder(folder, business, uploadType),
    publicId: uploadPublicId(fileName, uploadType),
    resourceType: uploadResourceType(uploadType)
  };
}
