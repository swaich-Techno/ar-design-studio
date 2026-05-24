import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Campaign from "@/models/Campaign";
import Product from "@/models/Product";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicTracker } from "@/components/public/PublicTracker";

export const dynamic = "force-dynamic";

export default async function PublicCampaignPage({ params }) {
  await connectDB();
  const business = await Business.findOne({ slug: params.businessSlug }).lean();
  if (!business || !business.isActive) notFound();
  const campaign = await Campaign.findOne({ businessId: business._id, slug: params.campaignSlug, isActive: true }).lean();
  if (!campaign) notFound();
  const products = await Product.find({ businessId: business._id, _id: { $in: campaign.selectedProductIds || [] }, isAvailable: true })
    .select("name slug category price discountPrice shortDescription imageUrl offerText isFeatured")
    .lean();

  return (
    <main className="min-h-screen bg-surface">
      <PublicTracker payload={{ businessSlug: business.slug, campaignSlug: campaign.slug, eventType: "campaign_view" }} />
      <section className="relative overflow-hidden bg-ink px-5 py-10 text-white">
        {campaign.bannerImageUrl ? <img src={campaign.bannerImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /> : null}
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">{business.businessName}</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">{campaign.title}</h1>
          {campaign.offerText ? <p className="mt-4 inline-flex rounded-full bg-orange-500 px-4 py-2 font-black">{campaign.offerText}</p> : null}
          <p className="mt-5 max-w-2xl text-slate-200">{campaign.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8">
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={String(product._id)} businessSlug={business.slug} product={product} />)}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-black">Campaign products coming soon</h2>
          </div>
        )}
      </section>
    </main>
  );
}
