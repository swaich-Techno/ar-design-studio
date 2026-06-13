"use client";

import { useState } from "react";

export function ImageUploadField({
  value,
  onChange,
  onUploaded,
  label = "File URL",
  folder = "ar-design-studio",
  accept = "image/*",
  uploadType = "image",
  placeholder = "Paste URL or upload",
  extraFields = {}
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file) {
    if (!file) return;
    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    form.append("uploadType", uploadType);
    Object.entries(extraFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") form.append(key, value);
    });
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      onChange(data.url);
      onUploaded?.(data);
    } else {
      setError(data.error || "Upload failed");
    }
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-black">{label}</label>
      <input className="field" value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <input className="text-sm" type="file" accept={accept} onChange={(event) => upload(event.target.files?.[0])} />
      {loading ? <p className="text-sm font-bold text-brand">Uploading...</p> : null}
      {error ? <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{error}</p> : null}
    </div>
  );
}
