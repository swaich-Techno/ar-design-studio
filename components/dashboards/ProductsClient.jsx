"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";

export function ProductsClient({ staffMode = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(product) {
    await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable })
    });
    load();
  }

  if (loading) return <p className="font-bold text-slate-600">Loading products...</p>;
  if (!products.length) {
    return <EmptyState title="No products yet" text="Add your first product with image, price, GLB URL, and WhatsApp-ready public page." action={!staffMode ? <Button href="/business/products/new" variant="accent">Add product</Button> : null} />;
  }

  return (
    <div className="grid gap-4">
      {!staffMode ? <div className="flex justify-end"><Button href="/business/products/new" variant="accent">Add product</Button></div> : null}
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[80px_1fr_auto] md:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-lg font-black">{product.name}</p>
              <p className="text-sm font-semibold text-slate-500">₹{product.discountPrice || product.price || 0} • {product.category}</p>
              <p className="text-xs font-bold text-brand">{product.modelGlbUrl ? "3D/AR model connected" : "3D/AR model missing"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.publicUrl ? <a className="rounded-2xl border px-4 py-2 text-sm font-bold" href={product.publicUrl} target="_blank">Public page</a> : null}
              {!staffMode ? <Link className="rounded-2xl border px-4 py-2 text-sm font-bold" href={`/business/products/${product._id}/edit`}>Edit</Link> : null}
              <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold" onClick={() => toggle(product)}>{product.isAvailable ? "Available" : "Out of stock"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
