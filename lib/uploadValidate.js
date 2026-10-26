const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MODEL_EXT = new Set([".glb", ".usdz"]);
const BLOCKED_EXT = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".scr",
  ".js",
  ".mjs",
  ".cjs",
  ".php",
  ".phtml",
  ".html",
  ".htm",
  ".svg",
  ".xml",
  ".sh",
  ".bash",
  ".ps1",
  ".dll",
  ".so",
  ".apk",
  ".jar",
  ".wasm"
]);

function bytesStartWith(buffer, signature) {
  if (!buffer || buffer.length < signature.length) return false;
  return signature.every((byte, index) => buffer[index] === byte);
}

function asciiAt(buffer, offset, text) {
  const expected = Buffer.from(text, "ascii");
  if (buffer.length < offset + expected.length) return false;
  return buffer.slice(offset, offset + expected.length).equals(expected);
}

export function fileExtension(fileName = "") {
  const match = String(fileName).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

export function looksLikeImage(buffer) {
  if (!buffer || buffer.length < 12) return false;
  if (bytesStartWith(buffer, [0xff, 0xd8, 0xff])) return true;
  if (bytesStartWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return true;
  if (asciiAt(buffer, 0, "RIFF") && asciiAt(buffer, 8, "WEBP")) return true;
  return false;
}

export function looksLikeGlb(buffer) {
  return asciiAt(buffer, 0, "glTF");
}

export function looksLikeUsdz(buffer) {
  return asciiAt(buffer, 0, "PK");
}

export function validateUploadMeta({ fileName, uploadType = "image", mimeType = "" }) {
  const extension = fileExtension(fileName);
  if (!extension || BLOCKED_EXT.has(extension)) {
    return { error: "This file type is not allowed.", status: 400 };
  }
  if (uploadType === "model") {
    if (!MODEL_EXT.has(extension)) return { error: "Only .glb and .usdz model files are allowed.", status: 400 };
    return { ok: true, extension };
  }
  if (!IMAGE_EXT.has(extension)) return { error: "Only JPG, PNG, and WEBP images are allowed.", status: 400 };
  const mime = String(mimeType || "").toLowerCase();
  if (mime && !["image/jpeg", "image/png", "image/webp", "application/octet-stream", ""].includes(mime)) {
    return { error: "Image type is not allowed.", status: 400 };
  }
  return { ok: true, extension };
}

export function validateUploadBuffer(buffer, uploadType = "image") {
  if (!buffer || !buffer.length) return { error: "File is empty.", status: 400 };
  if (uploadType === "model") {
    if (looksLikeGlb(buffer) || looksLikeUsdz(buffer)) return { ok: true };
    return { error: "Model file contents are not a valid GLB or USDZ.", status: 400 };
  }
  if (looksLikeImage(buffer)) return { ok: true };
  return { error: "Image file contents are not a valid JPG, PNG, or WEBP.", status: 400 };
}

export function isAllowedHostedAssetUrl(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:") return false;
    return url.hostname === "res.cloudinary.com" || url.hostname.endsWith(".cloudinary.com");
  } catch {
    return false;
  }
}
