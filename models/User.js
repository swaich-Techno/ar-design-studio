import mongoose from "mongoose";
import { DEFAULT_STAFF_PERMISSIONS, ROLES } from "@/lib/permissions";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    permissions: {
      canEditProducts: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canEditProducts },
      canViewLeads: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canViewLeads },
      canDownloadQR: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canDownloadQR },
      canEditAvailability: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canEditAvailability },
      canManageOrders: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canManageOrders },
      canManageCampaigns: { type: Boolean, default: DEFAULT_STAFF_PERMISSIONS.canManageCampaigns }
    },
    department: { type: String, default: "" },
    salaryAmount: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: "INR" },
    joiningDate: Date,
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
