import Link from "next/link";

export function ProductCard({ businessSlug, product, query = "" }) {
  const price = product.discountPrice || product.price;
  return (
    <Link href={`/b/${businessSlug}/product/${product.slug}${query}`} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/3] bg-slate-100">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm font-bold text-slate-500">No image</div>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{product.category}</p>
            <h3 className="mt-1 text-lg font-black text-ink">{product.name}</h3>
          </div>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black">₹{price || 0}</p>
        </div>
        {product.offerText ? <p className="mt-3 rounded-2xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">{product.offerText}</p> : null}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription || "View details, 3D preview, and WhatsApp ordering."}</p>
      </div>
    </Link>
  );
}
