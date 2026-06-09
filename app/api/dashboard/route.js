import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { ROLES } from "@/lib/permissions";
import Analytics from "@/models/Analytics";
import AuditLog from "@/models/AuditLog";
import Business from "@/models/Business";
import Campaign from "@/models/Campaign";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import User from "@/models/User";

async function eventCount(query, eventType) {
  return Analytics.countDocuments({ ...query, eventType });
}

export async function GET() {
  const { user, error } = await requireUser([ROLES.SUPER_ADMIN, ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();

  if (user.role === ROLES.SUPER_ADMIN) {
    const [businesses, products, users, scans, recentBusinesses, recentAudit] = await Promise.all([
      Business.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Analytics.countDocuments(),
      Business.find().sort({ createdAt: -1 }).limit(6).lean(),
      AuditLog.find().sort({ createdAt: -1 }).limit(8).lean()
    ]);
    return json({ role: user.role, stats: { businesses, products, users, scans }, recentBusinesses, recentAudit });
  }

  const businessId = user.businessId;
  const [business, products, arProducts, tables, campaigns, scans, whatsapp, arViews, recentProducts, topProducts] = await Promise.all([
    Business.findById(businessId).lean(),
    Product.countDocuments({ businessId }),
    Product.countDocuments({ businessId, hasARModel: true }),
    TableQR.countDocuments({ businessId }),
    Campaign.countDocuments({ businessId }),
    Analytics.countDocuments({ businessId }),
    eventCount({ businessId }, "whatsapp_click"),
    eventCount({ businessId }, "ar_view"),
    Product.find({ businessId }).sort({ createdAt: -1 }).limit(5).lean(),
    Product.find({ businessId }).sort({ views: -1 }).limit(5).lean()
  ]);

  return json({
    role: user.role,
    business,
    stats: {
      products,
      arProducts,
      tables,
      campaigns,
      scans,
      whatsapp,
      arViews,
      usedStorageMB: business?.usedStorageMB || 0,
      storageLimitMB: business?.storageLimitMB || 0,
      arProductLimit: business?.arProductLimit || 0
    },
    recentProducts,
    topProducts
  });
}
