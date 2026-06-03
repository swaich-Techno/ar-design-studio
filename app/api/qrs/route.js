import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { campaignPublicUrl, cataloguePublicUrl, generateQrDataUrl, productPublicUrl, tablePublicUrl } from "@/lib/qr";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import Product from "@/models/Product";
import TableQR from "@/models/TableQR";
import Campaign from "@/models/Campaign";

export async function GET() {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  const [products, tables, campaigns] = await Promise.all([
    Product.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean(),
    TableQR.find({ businessId: user.businessId }).sort({ tableNumber: 1 }).lean(),
    Campaign.find({ businessId: user.businessId }).sort({ createdAt: -1 }).lean()
  ]);

  const catalogueUrl = cataloguePublicUrl(business.slug);
  return json({
    catalogue: {
      label: `${business.businessName} catalogue`,
      publicUrl: catalogueUrl,
      qrCodeDataUrl: await generateQrDataUrl(catalogueUrl)
    },
    products: await Promise.all(products.map(async (product) => {
      const publicUrl = productPublicUrl(business.slug, product.slug);
      return { id: product._id, label: product.name, publicUrl, qrCodeDataUrl: await generateQrDataUrl(publicUrl) };
    })),
    tables: tables.map((table) => ({
      id: table._id,
      label: table.tableName || `Table ${table.tableNumber}`,
      publicUrl: table.publicUrl || tablePublicUrl(business.slug, table.tableNumber),
      qrCodeDataUrl: table.qrCodeDataUrl
    })),
    campaigns: campaigns.map((campaign) => ({
      id: campaign._id,
      label: campaign.title,
      publicUrl: campaignPublicUrl(business.slug, campaign.slug),
      qrCodeDataUrl: campaign.qrCodeDataUrl
    }))
  });
}
