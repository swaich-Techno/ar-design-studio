import { v2 as cloudinary } from "cloudinary";
import { uploadPublicId } from "@/lib/uploadPolicy";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export function getCloudinaryDirectUpload({ folder, resourceType = "image", publicId, fileName = "upload" }) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    folder,
    overwrite: "false",
    public_id: publicId || uploadPublicId(fileName, resourceType === "raw" ? "model" : "image"),
    timestamp
  };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    params: {
      ...params,
      api_key: process.env.CLOUDINARY_API_KEY,
      signature
    }
  };
}

export async function uploadBuffer(buffer, { folder = "ar-design-studio", resourceType = "image", fileName = "upload", publicId } = {}) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const options = {
    folder,
    resource_type: resourceType,
    overwrite: false,
    public_id: publicId || uploadPublicId(fileName, resourceType === "raw" ? "model" : "image"),
    timeout: 180000
  };

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, uploadResult) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(uploadResult);
    });
    stream.end(buffer);
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
