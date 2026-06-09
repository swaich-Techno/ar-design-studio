import { connectDB } from "@/lib/mongodb";
import { json, requireUser } from "@/lib/api";
import { generateQrDataUrl, tablePublicUrl } from "@/lib/qr";
import { ROLES } from "@/lib/permissions";
import Business from "@/models/Business";
import TableQR from "@/models/TableQR";

export async function GET() {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER, ROLES.STAFF]);
  if (error) return error;
  await connectDB();
  const tables = await TableQR.find({ businessId: user.businessId }).sort({ tableNumber: 1 }).lean();
  return json({ tables });
}

export async function POST(request) {
  const { user, error } = await requireUser([ROLES.BUSINESS_OWNER]);
  if (error) return error;
  const body = await request.json();
  if (!body.tableNumber) return json({ error: "Table number is required." }, 400);
  await connectDB();
  const business = await Business.findById(user.businessId);
  const publicUrl = tablePublicUrl(business.slug, body.tableNumber);
  const table = await TableQR.findOneAndUpdate(
    { businessId: business._id, tableNumber: String(body.tableNumber) },
    {
      tableName: body.tableName || "",
      publicUrl,
      qrCodeDataUrl: await generateQrDataUrl(publicUrl),
      isActive: body.isActive !== false
    },
    { upsert: true, new: true }
  );
  return json({ table }, 201);
}
