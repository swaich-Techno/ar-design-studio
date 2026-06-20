"use client";

import { UploadCloud } from "lucide-react";
import { useId, useState } from "react";

const MODEL_EXTENSIONS = [".glb", ".usdz"];

function fileSizeLabel(bytes = 0) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(mb >= 10 ? 0 : 1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function isAllowedModel(file) {
  const lower = String(file?.name || "").toLowerCase();
  return MODEL_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

function parseXhrResponse(xhr) {
  if (xhr.response && typeof xhr.response === "object") return xhr.response;
  try {
    return JSON.parse(xhr.responseText || "{}");
  } catch {
    return {};
  }
}

function sendFormData({ url, form, onProgress, timeout = 300000 }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.timeout = timeout;
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.max(1, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      const data = parseXhrResponse(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }
      reject(new Error(data.error || data.message || "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading. Check your connection and try again."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Try a smaller file or paste a hosted file URL."));
    xhr.send(form);
  });
}

export function ImageUploadField({
  value,
  onChange,
  onUploaded,
  label = "File URL",
  folder = "ar-design-studio",
  accept = "image/*",
  uploadType = "image",
  placeholder = "Paste URL or upload",
  extraFields = {},
  helperText = ""
}) {
  const inputId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");

  async function directUpload(file) {
    const signatureResponse = await fetch("/api/upload/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        folder,
        uploadType,
        ...extraFields
      })
    });
    const signatureData = await signatureResponse.json().catch(() => ({}));

    if (!signatureResponse.ok) {
      if (signatureResponse.status >= 500 || signatureResponse.status === 404) return null;
      throw new Error(signatureData.error || "Upload is not allowed for this file.");
    }

    const cloudForm = new FormData();
    Object.entries(signatureData.params || {}).forEach(([key, value]) => cloudForm.append(key, value));
    cloudForm.append("file", file);
    const cloudinaryData = await sendFormData({
      url: signatureData.uploadUrl,
      form: cloudForm,
      onProgress: setProgress
    });
    const asset = {
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
      bytes: cloudinaryData.bytes || file.size,
      fileSize: file.size,
      fileSizeMB: signatureData.fileSizeMB,
      uploadType
    };

    const completeResponse = await fetch("/api/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset)
    });
    const completeData = await completeResponse.json().catch(() => ({}));
    if (!completeResponse.ok) {
      return { ...asset, warning: completeData.error || "Uploaded, but storage usage could not be recorded." };
    }
    return completeData;
  }

  async function serverUpload(file) {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    form.append("uploadType", uploadType);
    Object.entries(extraFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") form.append(key, value);
    });
    return sendFormData({ url: "/api/upload", form, onProgress: setProgress });
  }

  async function upload(file) {
    if (!file) return;
    if (uploadType === "model" && !isAllowedModel(file)) {
      setError("Choose a .glb or .usdz model file, or paste a hosted model URL.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setSelectedFile(`${file.name} (${fileSizeLabel(file.size)})`);

    try {
      const direct = await directUpload(file);
      const data = direct || await serverUpload(file);
      onChange(data.url);
      onUploaded?.(data);
      if (data.warning) setError(data.warning);
      setProgress(100);
    } catch (err) {
      setError(err.message || "Upload failed. Try again or paste a hosted URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label className="text-sm font-black" htmlFor={`${inputId}-url`}>{label}</label>
      <input
        id={`${inputId}-url`}
        className="field"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={loading}
      />
      <label
        htmlFor={`${inputId}-file`}
        className={`flex min-h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-teal-300 hover:bg-teal-50 ${loading ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="grid gap-2 justify-items-center text-sm font-bold text-slate-600">
          <UploadCloud className="text-brand" size={24} aria-hidden="true" focusable="false" />
          <span>{loading ? "Uploading. Keep this tab open." : uploadType === "model" ? "Upload GLB/USDZ model" : "Upload file"}</span>
          <span className="text-xs font-semibold text-slate-500">{selectedFile || helperText || "Choose a file here, or paste a hosted URL above."}</span>
        </span>
      </label>
      <input
        id={`${inputId}-file`}
        className="sr-only"
        type="file"
        accept={accept}
        disabled={loading}
        onChange={(event) => upload(event.target.files?.[0])}
      />
      {loading ? (
        <div className="grid gap-2" aria-live="polite">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.max(progress, 8)}%` }} />
          </div>
          <p className="text-sm font-bold text-brand">{progress ? `${progress}% uploaded` : "Preparing secure upload..."}</p>
        </div>
      ) : null}
      {error ? <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{error}</p> : null}
    </div>
  );
}
