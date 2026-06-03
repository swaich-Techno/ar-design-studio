import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadBuffer(buffer, { folder = "ar-design-studio", resourceType = "image", fileName = "upload" } = {}) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured.");
  }

  const mime = resourceType === "image" ? "image/jpeg" : "application/octet-stream";
  const dataUri = `data:${mime};base64,${Buffer.from(buffer).toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
    overwrite: false,
    use_filename: true,
    unique_filename: true,
    filename_override: fileName
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes || buffer.length
  };
}

export async function uploadImageBuffer(buffer, folder = "ar-design-studio") {
  return uploadBuffer(buffer, { folder, resourceType: "image" });
}
