import { notFound } from "next/navigation";
import { BadgeCheck, Box, MessageCircle, QrCode, Sparkles } from "lucide-react";
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
  const businessName = business.businessName || "Business catalogue";

  if (!business.isActive) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-5">
        <div className="max-w-md text-center">
          {business.logoUrl ? <img src={business.logoUrl} alt={businessName} className="mx-auto h-20 w-20 rounded-3xl object-cover" /> : null}
          <h1 className="mt-5 text-3xl font-black">{businessName}</h1>
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
  const featuredCount = products.filter((product) => product.isFeatured).length;
  const arCount = products.filter((product) => product.modelGlbUrl || product.hasARModel).length;

  return (
    <main className="min-h-screen bg-surface text-ink">
      <MarketingPixels business={{ googleAnalyticsId: business.googleAnalyticsId || "", metaPixelId: business.metaPixelId || "" }} />
      <PublicTracker payload={{ businessSlug: business.slug, eventType: "catalogue_view" }} />
      <section className="relative overflow-hidden bg-ink px-5 py-10 text-white">
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: business.brandColor || "#0f766e" }} />
        {business.coverImageUrl ? <img src={business.coverImageUrl} alt={`${businessName} digital QR catalogue cover`} className="absolute inset-0 h-full w-full object-cover opacity-25" /> : null}
        <div className="absolute -right-16 top-12 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={businessName} className="h-16 w-16 rounded-3xl object-cover ring-4 ring-white/10" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-xl font-black text-ink">{businessName[0]}</div>
              )}
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-200">{business.category}</p>
                <h1 className="text-3xl font-black md:text-5xl">{businessName}</h1>
              </div>
            </div>
            <p className="mt-5 max-w-2xl font-semibold leading-7 text-slate-200">{business.address || "Browse the catalogue, view product details, and order through WhatsApp."}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><QrCode size={14} /> QR catalogue</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><Sparkles size={14} /> {arCount} AR item(s)</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><MessageCircle size={14} /> WhatsApp ordering</span>
            </div>
          </div>
          <div className="grid min-w-56 gap-3 rounded-[28px] bg-white/10 p-5 backdrop-blur">
            <div>
              <p className="text-3xl font-black">{products.length}</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-100">Available products</p>
            </div>
            <div>
              <p className="text-3xl font-black">{featuredCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-100">Featured</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">{category}</span>)}
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-black text-teal-800">
            <BadgeCheck size={16} /> Scan-friendly mobile catalogue
          </p>
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={String(product._id)} businessSlug={business.slug} product={product} />)}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <Box className="mx-auto text-brand" size={42} />
            <h2 className="mt-4 text-2xl font-black">No available products yet</h2>
            <p className="mx-auto mt-2 max-w-md font-semibold leading-7 text-slate-600">This catalogue is ready, but the business owner still needs to publish products from the dashboard.</p>
          </div>
        )}
      </section>
    </main>
  );
}
