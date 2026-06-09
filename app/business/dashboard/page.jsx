import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Boxes, CalendarClock, MessageCircle, QrCode, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { StatGrid } from "@/components/dashboards/StatGrid";
import { UsageBar } from "@/components/dashboards/UsageBar";
import { ClientHealthPanel } from "@/components/dashboards/ClientHealthPanel";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import Business from "@/models/Business";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function statusTone(status) {
  if (["ACTIVE", "PAID", "TRIAL"].includes(status)) return "bg-teal-50 text-teal-800";
  if (["PAST_DUE", "OVERDUE", "EXPIRED", "FROZEN"].includes(status)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function BusinessDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/business/login");
  await connectDB();
  const business = await Business.findById(user.businessId).lean();
  const [products, arProducts, pendingApprovals, scans, whatsapp, arViews, calls, shares, staff, recentProducts] = await Promise.all([
    Product.countDocuments({ businessId: user.businessId }),
    Product.countDocuments({ businessId: user.businessId, hasARModel: true }),
    Product.countDocuments({ businessId: user.businessId, publicationStatus: { $ne: "PUBLISHED" } }),
    Analytics.countDocuments({ businessId: user.businessId }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "whatsapp_click" }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "ar_view" }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "call_click" }),
    Analytics.countDocuments({ businessId: user.businessId, eventType: "share_click" }),
    User.countDocuments({ businessId: user.businessId, role: { $in: ["BUSINESS_MANAGER", "BUSINESS_STAFF", "STAFF"] } }),
    Product.find({ businessId: user.businessId }).select("name slug category publicationStatus hasARModel stockStatus updatedAt").sort({ updatedAt: -1 }).limit(5).lean()
  ]);

  const publicCatalogue = business?.slug ? `/b/${business.slug}` : "";
  const nextActions = [
    products === 0 ? ["Add your first product", "/business/products/new", Boxes] : null,
    pendingApprovals > 0 ? [`Review ${pendingApprovals} pending product item(s)`, "/business/products", AlertTriangle] : null,
    arProducts < Number(business?.arProductLimit || 0) ? ["Add or approve another AR product", "/business/products", Sparkles] : null,
    !business?.whatsapp ? ["Add WhatsApp number for lead capture", "/business/profile", MessageCircle] : null,
    business?.paymentStatus === "OVERDUE" ? ["Clear overdue payment to keep catalogue active", "/business/billing", CalendarClock] : null
  ].filter(Boolean).slice(0, 4);

  return (
    <DashboardShell role="BUSINESS_OWNER" title="Business command center">
      <div className="grid gap-6">
        <section className="rounded-[32px] bg-ink p-6 text-white shadow-soft">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Owner action center</p>
              <h2 className="mt-2 text-3xl font-black">{business?.businessName || "Business catalogue"}</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-300">
                Track catalogue readiness, QR traffic, AR usage, billing status, and the actions that move customers toward WhatsApp enquiries.
              </p>
            </div>
            <div className="grid gap-2 text-sm font-black">
              <span className={`rounded-full px-4 py-2 ${statusTone(business?.subscriptionStatus)}`}>Subscription: {business?.subscriptionStatus || "Not set"}</span>
              <span className={`rounded-full px-4 py-2 ${statusTone(business?.paymentStatus)}`}>Payment: {business?.paymentStatus || "Not set"}</span>
            </div>
          </div>
          {publicCatalogue ? (
            <Link href={publicCatalogue} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-ink">
              Open public catalogue <ArrowRight size={17} />
            </Link>
          ) : null}
        </section>

        <StatGrid items={[
          { label: "Products", value: `${products}/${business?.productLimit || 0}`, helper: "Catalogue slots used", tone: "brand" },
          { label: "QR scans/events", value: scans, helper: "All public interactions", tone: "ink" },
          { label: "WhatsApp leads", value: whatsapp, helper: "High-intent enquiries", tone: "accent" },
          { label: "AR views", value: arViews, helper: `${arProducts}/${business?.arProductLimit || 0} AR products`, tone: "brand" }
        ]} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Plan usage</p>
                <h2 className="mt-1 text-2xl font-black">Keep the catalogue inside plan limits</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">{business?.subscriptionPlan || "Starter"}</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <UsageBar label="Storage" used={Math.round(Number(business?.usedStorageMB || 0) * 100) / 100} limit={business?.storageLimitMB || 0} unit=" MB" />
              <UsageBar label="AR products" used={arProducts} limit={business?.arProductLimit || 0} zeroLabel="Not included" />
              <UsageBar label="Products" used={products} limit={business?.productLimit || 0} />
              <UsageBar label="Staff" used={staff} limit={business?.staffLimit || 0} />
            </div>
            <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-brand">
              Next billing date: {formatDate(business?.nextBillingDate)}. Outstanding amount: Rs. {Number(business?.outstandingAmount || 0).toLocaleString("en-IN")}.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Next best actions</p>
            <h2 className="mt-1 text-2xl font-black">What to do now</h2>
            <div className="mt-5 grid gap-3">
              {nextActions.length ? nextActions.map(([label, href, Icon]) => (
                <Link key={label} href={href} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-teal-50 hover:text-brand">
                  <span className="flex items-center gap-3"><Icon size={18} /> {label}</span>
                  <ArrowRight size={16} />
                </Link>
              )) : (
                <p className="flex gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
                  <BadgeCheck size={18} /> Usage, approvals, billing, and contact setup look ready.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ClientHealthPanel business={business} products={products} arProducts={arProducts} staff={staff} pendingApprovals={pendingApprovals} />
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Recent products</p>
                <h2 className="mt-1 text-2xl font-black">Catalogue activity</h2>
              </div>
              <BarChart3 className="text-brand" />
            </div>
            <div className="mt-5 grid gap-3">
              {recentProducts.length ? recentProducts.map((product) => (
                <Link key={String(product._id)} href={`/business/products/${product._id}/edit`} className="rounded-2xl bg-slate-50 p-4 text-sm transition hover:bg-slate-100">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-ink">{product.name}</p>
                      <p className="mt-1 font-semibold text-slate-500">{product.category || "General"} - {product.publicationStatus}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${product.hasARModel ? "bg-teal-50 text-teal-800" : "bg-slate-200 text-slate-700"}`}>
                      {product.hasARModel ? "AR" : "Image"}
                    </span>
                  </div>
                </Link>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center">
                  <QrCode className="mx-auto text-brand" />
                  <p className="mt-3 font-black">No products yet</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Add products to generate QR pages and track customer interest.</p>
                </div>
              )}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Calls: <span className="text-ink">{calls}</span></div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Shares: <span className="text-ink">{shares}</span></div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Pending: <span className="text-ink">{pendingApprovals}</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
