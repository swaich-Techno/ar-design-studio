import mongoose from "mongoose";

const TableQRSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    tableNumber: { type: String, required: true, trim: true },
    tableName: { type: String, default: "" },
    publicUrl: { type: String, default: "" },
    qrCodeDataUrl: { type: String, default: "" },
    scans: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

TableQRSchema.index({ businessId: 1, tableNumber: 1 }, { unique: true });

export default mongoose.models.TableQR || mongoose.model("TableQR", TableQRSchema);
