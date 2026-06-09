import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", index: true },
    invoiceNumber: { type: String, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["SETUP", "MONTHLY", "ADDON", "SERVICE", "CUSTOM"], default: "MONTHLY" },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["PAID", "PENDING", "OVERDUE", "CANCELLED"], default: "PENDING" },
    dueDate: Date,
    paidAt: Date,
    paymentMethod: { type: String, default: "" },
    notes: { type: String, default: "" },
    reminderSentAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
