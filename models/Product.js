import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    category: { type: String, default: "General" },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    galleryImages: [{ type: String }],
    fileSizeMB: { type: Number, default: 0 },
    modelGlbUrl: { type: String, default: "" },
    modelUsdzUrl: { type: String, default: "" },
    modelFileSizeMB: { type: Number, default: 0 },
    hasARModel: { type: Boolean, default: false },
    offerText: { type: String, default: "" },
    tags: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    arViews: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    callClicks: { type: Number, default: 0 },
    shareClicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProductSchema.index({ businessId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
