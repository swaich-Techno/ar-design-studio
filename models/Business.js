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
    subscriptionPlan: { type: String, enum: ["Starter", "Growth", "Premium"], default: "Starter" },
    subscriptionStatus: { type: String, enum: ["ACTIVE", "INACTIVE", "TRIAL", "EXPIRED"], default: "TRIAL" },
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
