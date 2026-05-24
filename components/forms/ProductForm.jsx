"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

const empty = {
  name: "",
  category: "",
  price: "",
  discountPrice: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  fileSizeMB: 0,
  galleryImages: "",
  modelGlbUrl: "",
  modelUsdzUrl: "",
  modelFileSizeMB: 0,
  hasARModel: false,
  offerText: "",
  tags: "",
  isAvailable: true,
  isFeatured: false
};

export function ProductForm({ productId }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`).then((res) => res.json()).then((data) => {
      if (data.product) {
        setForm({
          ...empty,
          ...data.product,
          fileSizeMB: data.product.fileSizeMB || 0,
          modelFileSizeMB: data.product.modelFileSizeMB || 0,
          hasARModel: Boolean(data.product.hasARModel || data.product.modelGlbUrl || data.product.modelUsdzUrl),
          galleryImages: (data.product.galleryImages || []).join(", "),
          tags: (data.product.tags || []).join(", ")
        });
      }
    });
  }, [productId]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
      method: productId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Product save failed.");
      return;
    }
    router.push("/business/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="field" placeholder="Product name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input className="field" placeholder="Category" value={form.category} onChange={(e) => update("category", e.target.value)} />
        <input className="field" type="number" placeholder="Price" value={form.price} onChange={(e) => update("price", e.target.value)} />
        <input className="field" type="number" placeholder="Discount price" value={form.discountPrice} onChange={(e) => update("discountPrice", e.target.value)} />
      </div>
      <textarea className="field min-h-24" placeholder="Short description" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
      <textarea className="field min-h-32" placeholder="Full description" value={form.description} onChange={(e) => update("description", e.target.value)} />
      <ImageUploadField
        value={form.imageUrl}
        onChange={(value) => update("imageUrl", value)}
        onUploaded={(file) => update("fileSizeMB", file.fileSizeMB || 0)}
        label="Product image"
        folder="ar-design-studio-products"
      />
      <div className="grid gap-2 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-black">AR/3D model hosting</p>
            <p className="text-sm font-semibold text-slate-500">GLB works for web/Android. USDZ improves iPhone/iPad AR Quick Look.</p>
          </div>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" checked={Boolean(form.hasARModel)} onChange={(e) => update("hasARModel", e.target.checked)} />
            Has AR/3D model
          </label>
        </div>
        <ImageUploadField
          value={form.modelGlbUrl}
          onChange={(value) => {
            update("modelGlbUrl", value);
            update("hasARModel", Boolean(value || form.modelUsdzUrl));
          }}
          onUploaded={(file) => {
            update("modelFileSizeMB", Number(form.modelFileSizeMB || 0) + Number(file.fileSizeMB || 0));
            update("hasARModel", true);
          }}
          label="GLB model URL or upload"
          folder="ar-design-studio-models"
          accept=".glb,model/gltf-binary"
          uploadType="model"
          extraFields={{ productId }}
          placeholder="https://.../product.glb"
        />
        <ImageUploadField
          value={form.modelUsdzUrl}
          onChange={(value) => {
            update("modelUsdzUrl", value);
            update("hasARModel", Boolean(form.modelGlbUrl || value));
          }}
          onUploaded={(file) => {
            update("modelFileSizeMB", Number(form.modelFileSizeMB || 0) + Number(file.fileSizeMB || 0));
            update("hasARModel", true);
          }}
          label="USDZ model URL or upload"
          folder="ar-design-studio-models"
          accept=".usdz"
          uploadType="model"
          extraFields={{ productId }}
          placeholder="https://.../product.usdz"
        />
        <p className="text-xs font-bold text-slate-500">
          Starter has image catalogue only. Growth includes 5 AR/3D products. Premium includes 15 AR/3D products.
        </p>
      </div>
      <input className="field" placeholder="Offer/discount text" value={form.offerText} onChange={(e) => update("offerText", e.target.value)} />
      <input className="field" placeholder="Tags separated by commas" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={form.isAvailable} onChange={(e) => update("isAvailable", e.target.checked)} /> Available</label>
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Featured</label>
      </div>
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>{loading ? "Saving..." : productId ? "Update Product" : "Add Product"}</Button>
    </form>
  );
}
