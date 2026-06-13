import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, default: "" },
    offerText: { type: String, default: "" },
    bannerImageUrl: { type: String, default: "" },
    templateType: { type: String, enum: ["FESTIVAL", "LAUNCH", "EVENT", "SEASONAL", "CLEARANCE", "CUSTOM"], default: "CUSTOM" },
    demoPublicUrl: { type: String, default: "" },
    selectedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startDate: Date,
    endDate: Date,
    qrCodeDataUrl: { type: String, default: "" },
    status: { type: String, enum: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "LIVE", "REJECTED", "EXPIRED"], default: "PENDING_APPROVAL" },
    approvalNotes: { type: String, default: "" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    views: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

CampaignSchema.index({ businessId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
