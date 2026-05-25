import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import { ModelViewer } from "@/components/ar/ModelViewer";
import { ProductActions } from "@/components/public/ProductActions";
import { PublicTracker } from "@/components/public/PublicTracker";
import { MarketingPixels } from "@/components/public/MarketingPixels";

export const dynamic = "force-dynamic";

export default async function PublicProductPage({ params, searchParams }) {
  await connectDB();
  const business = await Business.findOne({ slug: params.businessSlug }).lean();
  if (!business || !business.isActive) notFound();

  const product = await Product.findOne({
    businessId: business._id,
    slug: params.productSlug,
    isAvailable: true,
    publicationStatus: { $in: ["APPROVED", "PUBLISHED"] }
  })
    .select("name slug category price discountPrice description shortDescription imageUrl galleryImages fabricImageUrl stitchedPreviewImageUrl stitchedPreviewNotes modelGlbUrl modelUsdzUrl offerText tags isAvailable hasARModel supportsRotation stockStatus stockQuantity showStockToCustomers productType")
    .lean();
  if (!product) notFound();

  const safeBusiness = {
    businessName: business.businessName,
    logoUrl: business.logoUrl,
    phone: business.phone,
    whatsapp: business.whatsapp,
    address: business.address,
    mapLink: business.mapLink,
    slug: business.slug
  };
  const safeProduct = JSON.parse(JSON.stringify(product));
  const price = safeProduct.discountPrice || safeProduct.price || 0;
  const tableNumber = searchParams?.table || "";
  const stockLabel = {
    IN_STOCK: "In stock",
    LOW_STOCK: "Low stock",
    OUT_OF_STOCK: "Out of stock",
    MADE_TO_ORDER: "Made to order"
  }[safeProduct.stockStatus || "IN_STOCK"];

  return (
    <main className="min-h-screen bg-surface">
      <MarketingPixels business={business} />
      <PublicTracker payload={{ businessSlug: business.slug, productSlug: product.slug, eventType: "product_view" }} />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1.08fr_0.92fr]">
        <ModelViewer product={safeProduct} trackingPayload={{ businessSlug: business.slug, productSlug: product.slug }} />
        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            {business.logoUrl ? <img src={business.logoUrl} alt={business.businessName} className="h-12 w-12 rounded-2xl object-cover" /> : null}
            <div>
              <p className="text-sm font-bold text-brand">{business.businessName}</p>
              <p className="text-xs font-semibold text-slate-500">{product.category}</p>
            </div>
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-black text-brand">Rs. {price}</p>
            {product.discountPrice ? <p className="text-lg font-bold text-slate-400 line-through">Rs. {product.price}</p> : null}
            {product.showStockToCustomers !== false ? (
              <span className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${product.stockStatus === "OUT_OF_STOCK" ? "bg-red-100 text-red-700" : "bg-teal-50 text-teal-800"}`}>{stockLabel}</span>
            ) : null}
          </div>
          {product.offerText ? <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 font-bold text-orange-700">{product.offerText}</p> : null}
          {product.stitchedPreviewNotes ? <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold leading-6 text-teal-800">{product.stitchedPreviewNotes}</p> : null}
          <p className="mt-5 leading-8 text-slate-600">{product.description || product.shortDescription || "View this product in 3D/AR and order through WhatsApp."}</p>
          <div className="mt-6">
            <ProductActions business={safeBusiness} product={safeProduct} tableNumber={tableNumber} />
          </div>
        </aside>
      </section>
    </main>
  );
}
