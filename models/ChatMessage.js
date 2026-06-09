import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true, trim: true },
    senderRole: { type: String, required: true, trim: true },
    senderType: { type: String, enum: ["INTERNAL", "CLIENT"], required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isReadByClient: { type: Boolean, default: false },
    isReadByTeam: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ChatMessageSchema.index({ businessId: 1, createdAt: -1 });

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);
