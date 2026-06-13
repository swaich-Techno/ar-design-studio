import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import { PublicTracker } from "@/components/public/PublicTracker";
import { TableCartMenu } from "@/components/public/TableCartMenu";
import { MarketingPixels } from "@/components/public/MarketingPixels";

export const dynamic = "force-dynamic";

export default async function PublicTablePage({ params }) {
  const { businessSlug, tableNumber } = await params;
  await connectDB();
  const business = await Business.findOne({ slug: businessSlug }).lean();
  if (!business || !business.isActive) notFound();
  const businessName = business.businessName || "Business";

  const table = await TableQR.findOne({ businessId: business._id, tableNumber, isActive: true }).lean();
  if (!table) notFound();

  const products = await Product.find({ businessId: business._id, isAvailable: true, publicationStatus: { $in: ["APPROVED", "PUBLISHED"] } })
    .select("name slug category price discountPrice shortDescription imageUrl fabricImageUrl stitchedPreviewImageUrl offerText isFeatured modelGlbUrl hasARModel supportsRotation stockStatus stockQuantity showStockToCustomers tags productType")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  const safeBusiness = {
    businessName,
    whatsapp: business.whatsapp,
    slug: business.slug
  };
  const safeTable = JSON.parse(JSON.stringify(table));
  const safeProducts = JSON.parse(JSON.stringify(products));

  return (
    <main className="min-h-screen bg-surface">
      <MarketingPixels business={{ googleAnalyticsId: business.googleAnalyticsId || "", metaPixelId: business.metaPixelId || "" }} />
      <PublicTracker payload={{ businessSlug: business.slug, tableNumber: table.tableNumber, eventType: "table_scan" }} />
      <section className="bg-ink px-5 py-8 text-white">
        <div className="mx-auto mb-5 h-1 max-w-6xl rounded-full" style={{ backgroundColor: business.brandColor || "#0f766e" }} />
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Table QR menu</p>
          <h1 className="mt-2 text-4xl font-black">{businessName}</h1>
          <p className="mt-2 text-slate-200">Table Number: {table.tableNumber} {table.tableName ? `- ${table.tableName}` : ""}</p>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-300">Tap any item to view details, AR if available, and send a WhatsApp order with this table number attached.</p>
        </div>
      </section>
      <TableCartMenu business={safeBusiness} table={safeTable} products={safeProducts} />
    </main>
  );
}
