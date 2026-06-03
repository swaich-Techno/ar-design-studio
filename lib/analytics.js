import Analytics from "@/models/Analytics";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import Campaign from "@/models/Campaign";

const PRODUCT_COUNTERS = {
  product_view: "views",
  ar_view: "arViews",
  whatsapp_click: "whatsappClicks",
  call_click: "callClicks",
  share_click: "shareClicks"
};

export async function trackEvent({ businessId, productId, tableId, campaignId, eventType, request }) {
  const userAgent = request?.headers.get("user-agent") || "";
  const referrer = request?.headers.get("referer") || "";

  await Analytics.create({
    businessId,
    productId,
    tableId,
    campaignId,
    eventType,
    device: /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop",
    browser: userAgent.slice(0, 180),
    referrer
  });

  if (productId && PRODUCT_COUNTERS[eventType]) {
    await Product.findByIdAndUpdate(productId, { $inc: { [PRODUCT_COUNTERS[eventType]]: 1 } });
  }

  if (tableId && eventType === "table_scan") {
    await TableQR.findByIdAndUpdate(tableId, { $inc: { scans: 1 } });
  }

  if (campaignId) {
    const inc = eventType === "whatsapp_click" ? { whatsappClicks: 1 } : { views: 1 };
    await Campaign.findByIdAndUpdate(campaignId, { $inc: inc });
  }
}
