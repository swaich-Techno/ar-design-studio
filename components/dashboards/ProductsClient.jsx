"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { ARCompatibilityChecklist } from "@/components/dashboards/ARCompatibilityChecklist";
import { ProductImportCard } from "@/components/dashboards/ProductImportCard";

export function ProductsClient({ staffMode = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductId, setBusyProductId] = useState("");

  async function load() {
    try {
      setError("");
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Products could not be loaded. Please login again or check the server logs.");
        setProducts([]);
        return;
      }
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Products could not be loaded.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(product) {
    setBusyProductId(product._id);
    const response = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable })
    });
    setBusyProductId("");
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Product availability could not be updated.");
      return;
    }
    load();
  }

  async function removeProduct(product) {
    const confirmed = window.confirm(`Delete "${product.name}" permanently? This removes it from the dashboard and public QR pages.`);
    if (!confirmed) return;
    setBusyProductId(product._id);
    const response = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    setBusyProductId("");
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Product could not be deleted.");
      return;
    }
    load();
  }

  if (loading) return <p className="font-bold text-slate-600">Loading products...</p>;
  if (error) {
    return (
      <div className="rounded-[26px] border border-red-200 bg-red-50 p-5">
        <h2 className="text-xl font-black text-red-800">Products are not loading</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-red-700">{error}</p>
        <Button type="button" variant="light" className="mt-4" onClick={load}>Try again</Button>
      </div>
    );
  }
  if (!products.length) {
    return <EmptyState title="No products yet" text="Add your first product with image, price, GLB URL, and WhatsApp-ready public page." action={!staffMode ? <Button href="/business/products/new" variant="accent">Add product</Button> : null} />;
  }

  return (
    <div className="grid gap-4">
      {!staffMode ? <div className="flex justify-end"><Button href="/business/products/new" variant="accent">Add product</Button></div> : null}
      {!staffMode ? <ProductImportCard onImported={load} /> : null}
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[80px_1fr_auto] md:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-lg font-black">{product.name}</p>
              <p className="text-sm font-semibold text-slate-500">Rs. {product.discountPrice || product.price || 0} - {product.category}</p>
              <p className="text-xs font-bold text-brand">{product.modelGlbUrl ? "3D/AR model connected" : "3D/AR model missing"}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">Status: {product.publicationStatus || "PENDING_APPROVAL"} - Stock: {product.stockStatus || "IN_STOCK"}</p>
              <ARCompatibilityChecklist product={product} />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.publicUrl ? <a className="rounded-2xl border px-4 py-2 text-sm font-bold" href={product.publicUrl} target="_blank" rel="noreferrer">Public page</a> : null}
              {!staffMode ? <Link className="rounded-2xl border px-4 py-2 text-sm font-bold" href={`/business/products/${product._id}/edit`}>Edit</Link> : null}
              <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold disabled:opacity-60" disabled={busyProductId === product._id} onClick={() => toggle(product)}>{product.isAvailable ? "Available" : "Out of stock"}</button>
              {!staffMode ? (
                <button className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 disabled:opacity-60" disabled={busyProductId === product._id} onClick={() => removeProduct(product)}>
                  {busyProductId === product._id ? "Working..." : "Delete"}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
