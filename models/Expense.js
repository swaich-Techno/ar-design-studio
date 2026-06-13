import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["CLOUDINARY", "VERCEL", "MODEL_PRODUCTION", "SALARY", "SOFTWARE", "MARKETING", "OTHER"], default: "OTHER" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "INR" },
    expenseDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
