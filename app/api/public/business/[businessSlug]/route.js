import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";

export async function GET(_request, { params }) {
  await connectDB();
  const business = await Business.findOne({ slug: params.businessSlug }).lean();
  if (!business) return NextResponse.json({ error: "Business not found." }, { status: 404 });
  if (!business.isActive) {
    return NextResponse.json({
      business: { businessName: business.businessName, logoUrl: business.logoUrl, slug: business.slug, isActive: false },
      products: []
    });
  }
  const products = await Product.find({ businessId: business._id, isAvailable: true })
    .select("name slug category price discountPrice shortDescription imageUrl offerText isFeatured")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();
  return NextResponse.json({
    business: {
      businessName: business.businessName,
      logoUrl: business.logoUrl,
      coverImageUrl: business.coverImageUrl,
      phone: business.phone,
      whatsapp: business.whatsapp,
      address: business.address,
      mapLink: business.mapLink,
      instagram: business.instagram,
      category: business.category,
      slug: business.slug,
      isActive: business.isActive
    },
    products
  });
}
