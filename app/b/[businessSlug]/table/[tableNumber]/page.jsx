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
  const products = await Product.find({ businessId: business._id, isAvailable: true })
    .select("name slug category price discountPrice shortDescription imageUrl offerText isFeatured")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-surface">
      <PublicTracker payload={{ businessSlug: business.slug, tableNumber: table.tableNumber, eventType: "table_scan" }} />
      <section className="bg-ink px-5 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Table QR menu</p>
          <h1 className="mt-2 text-4xl font-black">{business.businessName}</h1>
          <p className="mt-2 text-slate-200">Table Number: {table.tableNumber} {table.tableName ? `• ${table.tableName}` : ""}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={String(product._id)} businessSlug={business.slug} product={product} query={`?table=${encodeURIComponent(table.tableNumber)}`} />)}
      </section>
    </main>
  );
}
