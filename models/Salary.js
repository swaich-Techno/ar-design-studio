import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employeeName: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true, default: 0 },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["PENDING", "PAID", "HOLD"], default: "PENDING" },
    paymentDate: Date,
    notes: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

SalarySchema.pre("save", function calculateNet(next) {
  this.netSalary = Number(this.baseSalary || 0) + Number(this.bonus || 0) - Number(this.deductions || 0);
  next();
});

export default mongoose.models.Salary || mongoose.model("Salary", SalarySchema);
