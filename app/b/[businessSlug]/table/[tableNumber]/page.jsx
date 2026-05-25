import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicTracker } from "@/components/public/PublicTracker";

export const dynamic = "force-dynamic";

export default async function PublicTablePage({ params }) {
  await connectDB();
  const business = await Business.findOne({ slug: params.businessSlug }).lean();
  if (!business || !business.isActive) notFound();

  const table = await TableQR.findOne({ businessId: business._id, tableNumber: params.tableNumber, isActive: true }).lean();
  if (!table) notFound();

  const products = await Product.find({ businessId: business._id, isAvailable: true, publicationStatus: { $in: ["APPROVED", "PUBLISHED"] } })
    .select("name slug category price discountPrice shortDescription imageUrl offerText isFeatured modelGlbUrl hasARModel stockStatus stockQuantity showStockToCustomers tags")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  const categories = [...new Set(products.map((product) => product.category || "General"))];

  return (
    <main className="min-h-screen bg-surface">
      <PublicTracker payload={{ businessSlug: business.slug, tableNumber: table.tableNumber, eventType: "table_scan" }} />
      <section className="bg-ink px-5 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Table QR menu</p>
          <h1 className="mt-2 text-4xl font-black">{business.businessName}</h1>
          <p className="mt-2 text-slate-200">Table Number: {table.tableNumber} {table.tableName ? `- ${table.tableName}` : ""}</p>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-300">Tap any item to view details, AR if available, and send a WhatsApp order with this table number attached.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700">{category}</span>)}
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={String(product._id)} businessSlug={business.slug} product={product} query={`?table=${encodeURIComponent(table.tableNumber)}`} />)}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-black">No available menu items yet</h2>
            <p className="mt-2 text-slate-600">Please ask the restaurant team for current availability.</p>
          </div>
        )}
      </section>
    </main>
  );
}
