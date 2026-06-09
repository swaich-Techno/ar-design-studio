import Link from "next/link";
import { BadgeCheck, Box, Sparkles } from "lucide-react";

export function ProductCard({ businessSlug, product, query = "" }) {
  const price = product.discountPrice || product.price;
  const hasAR = Boolean(product.modelGlbUrl || product.modelUsdzUrl);
  const previewImage = product.imageUrl || product.stitchedPreviewImageUrl || product.fabricImageUrl;
  const stockLabel = {
    IN_STOCK: "In stock",
    LOW_STOCK: "Low stock",
    OUT_OF_STOCK: "Out of stock",
    MADE_TO_ORDER: "Made to order"
  }[product.stockStatus || "IN_STOCK"];
  const stockClass = product.stockStatus === "OUT_OF_STOCK" ? "bg-red-100 text-red-700" : "bg-white text-ink";

  return (
    <Link
      href={`/b/${businessSlug}/product/${product.slug}${query}`}
      className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {previewImage ? (
          <img src={previewImage} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-center text-sm font-bold text-slate-500">
            <div>
              <Box className="mx-auto text-brand" size={34} />
              <p className="mt-2">Product preview</p>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {hasAR ? <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-black text-white"><Sparkles size={13} /> AR ready</span> : null}
          {product.stitchedPreviewImageUrl ? <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">Stitched preview</span> : null}
        </div>
        {product.showStockToCustomers !== false ? (
          <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-black ${stockClass}`}>{stockLabel}</span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">{product.category || "Product"}</p>
            <h3 className="mt-1 text-xl font-black leading-tight text-ink">{product.name}</h3>
          </div>
          <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-black">Rs. {price || 0}</p>
        </div>
        {product.offerText ? <p className="mt-3 rounded-2xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">{product.offerText}</p> : null}
        <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">{product.shortDescription || "View details, 3D preview, and WhatsApp ordering."}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">
          <BadgeCheck size={16} /> View product and order
        </p>
      </div>
    </Link>
  );
}
