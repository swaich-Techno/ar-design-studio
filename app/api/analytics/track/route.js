import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { trackEvent } from "@/lib/analytics";
import Business from "@/models/Business";
import Campaign from "@/models/Campaign";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";

const allowed = new Set(["catalogue_view", "product_view", "ar_view", "whatsapp_click", "call_click", "location_click", "share_click", "table_scan", "campaign_view"]);

export async function POST(request) {
  try {
    const body = await request.json();
    if (!allowed.has(body.eventType)) return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
    await connectDB();

    const business = body.businessSlug ? await Business.findOne({ slug: body.businessSlug }).lean() : null;
    if (!business) return NextResponse.json({ ok: true });

    const product = body.productSlug ? await Product.findOne({ businessId: business._id, slug: body.productSlug }).lean() : null;
    const table = body.tableNumber ? await TableQR.findOne({ businessId: business._id, tableNumber: body.tableNumber }).lean() : null;
    const campaign = body.campaignSlug ? await Campaign.findOne({ businessId: business._id, slug: body.campaignSlug }).lean() : null;

    await trackEvent({
      businessId: business._id,
      productId: product?._id,
      tableId: table?._id,
      campaignId: campaign?._id,
      eventType: body.eventType,
      request
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
