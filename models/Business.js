import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    logoUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    address: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    instagram: { type: String, default: "" },
    category: { type: String, default: "Local shop" },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brandColor: { type: String, default: "#0f766e" },
    catalogueTemplate: { type: String, enum: ["MODERN", "RESTAURANT", "RETAIL", "LUXURY", "REAL_ESTATE"], default: "MODERN" },
    googleAnalyticsId: { type: String, default: "" },
    metaPixelId: { type: String, default: "" },
    monthlyReportEnabled: { type: Boolean, default: true },
    annualBillingDiscountMonths: { type: Number, default: 2 },
    subscriptionPlan: { type: String, enum: ["Starter", "Growth", "Premium", "Enterprise"], default: "Starter" },
    subscriptionStatus: { type: String, enum: ["ACTIVE", "INACTIVE", "TRIAL", "EXPIRED", "PAST_DUE", "FROZEN"], default: "TRIAL" },
    setupFee: { type: Number, default: 9999 },
    monthlyFee: { type: Number, default: 1999 },
    nextBillingDate: Date,
    outstandingAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["PAID", "PENDING", "OVERDUE", "CANCELLED"], default: "PENDING" },
    isFrozenForNonPayment: { type: Boolean, default: false },
    productLimit: { type: Number, default: 10 },
    storageLimitMB: { type: Number, default: 250 },
    usedStorageMB: { type: Number, default: 0 },
    arProductLimit: { type: Number, default: 0 },
    staffLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
