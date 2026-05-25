import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicTracker } from "@/components/public/PublicTracker";
import { MarketingPixels } from "@/components/public/MarketingPixels";

export const dynamic = "force-dynamic";

export default async function PublicCataloguePage({ params }) {
  const { businessSlug } = await params;
  await connectDB();
  const business = await Business.findOne({ slug: businessSlug }).lean();
  if (!business) notFound();

  if (!business.isActive) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-5">
        <div className="max-w-md text-center">
          {business.logoUrl ? <img src={business.logoUrl} alt={business.businessName} className="mx-auto h-20 w-20 rounded-3xl object-cover" /> : null}
          <h1 className="mt-5 text-3xl font-black">{business.businessName}</h1>
          <p className="mt-3 text-slate-600">This catalogue is currently unavailable.</p>
        </div>
      </main>
    );
  }

  const products = await Product.find({ businessId: business._id, isAvailable: true, publicationStatus: { $in: ["APPROVED", "PUBLISHED"] } })
    .select("name slug category price discountPrice shortDescription imageUrl fabricImageUrl stitchedPreviewImageUrl offerText isFeatured modelGlbUrl hasARModel supportsRotation stockStatus stockQuantity showStockToCustomers tags productType")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  const categories = [...new Set(products.map((product) => product.category || "General"))];

  return (
    <main className="min-h-screen bg-surface">
      <MarketingPixels business={business} />
      <PublicTracker payload={{ businessSlug: business.slug, eventType: "catalogue_view" }} />
      <section className="relative overflow-hidden bg-ink px-5 py-10 text-white">
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: business.brandColor || "#0f766e" }} />
        {business.coverImageUrl ? <img src={business.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" /> : null}
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            {business.logoUrl ? <img src={business.logoUrl} alt={business.businessName} className="h-16 w-16 rounded-3xl object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-xl font-black text-ink">{business.businessName[0]}</div>}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">{business.category}</p>
              <h1 className="text-3xl font-black">{business.businessName}</h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-slate-200">{business.address}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
            <span className="rounded-full bg-white/15 px-3 py-2">Mobile menu</span>
            <span className="rounded-full bg-white/15 px-3 py-2">AR available badges</span>
            <span className="rounded-full bg-white/15 px-3 py-2">WhatsApp ordering</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700">{category}</span>)}
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={String(product._id)} businessSlug={business.slug} product={product} />)}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-black">No available products yet</h2>
            <p className="mt-2 text-slate-600">The business owner can add products from the dashboard.</p>
          </div>
        )}
      </section>
    </main>
  );
}
