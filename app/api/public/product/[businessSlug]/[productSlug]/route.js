import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";

export async function GET(_request, { params }) {
  await connectDB();
  const business = await Business.findOne({ slug: params.businessSlug }).lean();
  if (!business || !business.isActive) return NextResponse.json({ error: "Product unavailable." }, { status: 404 });
  const product = await Product.findOne({ businessId: business._id, slug: params.productSlug, isAvailable: true })
    .select("name slug category price discountPrice description shortDescription imageUrl galleryImages modelGlbUrl modelUsdzUrl offerText tags isAvailable")
    .lean();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({
    business: {
      businessName: business.businessName,
      logoUrl: business.logoUrl,
      phone: business.phone,
      whatsapp: business.whatsapp,
      address: business.address,
      mapLink: business.mapLink,
      slug: business.slug
    },
    product
  });
}
