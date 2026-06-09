import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "TableQR" },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    eventType: {
      type: String,
      enum: [
        "catalogue_view",
        "product_view",
        "ar_view",
        "whatsapp_click",
        "call_click",
        "location_click",
        "share_click",
        "table_scan",
        "campaign_view"
      ],
      required: true
    },
    device: { type: String, default: "" },
    browser: { type: String, default: "" },
    referrer: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
