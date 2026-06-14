import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String, default: "SYSTEM" },
    action: { type: String, required: true },
    targetType: { type: String, default: "" },
    targetId: { type: String, default: "" },
    description: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
