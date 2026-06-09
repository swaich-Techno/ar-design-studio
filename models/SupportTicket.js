import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    ticketType: { type: String, enum: ["SUPPORT", "DEMO_REQUEST"], default: "SUPPORT", index: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], default: "OPEN" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
    requesterBusinessName: { type: String, default: "" },
    requesterName: { type: String, default: "" },
    requesterEmail: { type: String, lowercase: true, trim: true, default: "" },
    requesterPhone: { type: String, default: "" },
    requesterIndustry: { type: String, default: "" },
    demoStatus: { type: String, enum: ["REQUESTED", "APPROVED", "REJECTED", "CONVERTED"], default: "REQUESTED", index: true },
    demoProductLimit: { type: Number, default: 0 },
    demoArProductLimit: { type: Number, default: 0 },
    demoBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    demoOwnerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    demoApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    demoApprovedAt: Date
  },
  { timestamps: true }
);

export default mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
