import Link from "next/link";
import { BarChart3, Banknote, Boxes, Building2, CheckSquare, ClipboardList, Home, LifeBuoy, QrCode, Settings, Shield, Store, UserCog, Users } from "lucide-react";
import { LogoutButton } from "@/components/dashboards/LogoutButton";

const nav = {
  SUPER_ADMIN: [
    ["/super-admin/dashboard", "Dashboard", Shield],
    ["/super-admin/businesses", "Businesses", Building2],
    ["/super-admin/users", "Users", Users],
    ["/super-admin/products", "Products", Boxes],
    ["/super-admin/approvals", "Approvals", CheckSquare],
    ["/super-admin/analytics", "Analytics", BarChart3],
    ["/super-admin/finance", "Finance", Banknote],
    ["/super-admin/salaries", "Salaries", Banknote],
    ["/super-admin/team", "Team", UserCog],
    ["/super-admin/support", "Support", LifeBuoy],
    ["/super-admin/subscriptions", "Subscriptions", ClipboardList],
    ["/super-admin/audit-logs", "Audit logs", ClipboardList]
  ],
  TEAM_ADMIN: [
    ["/team/dashboard", "Dashboard", Home],
    ["/super-admin/approvals", "Approvals", CheckSquare],
    ["/super-admin/finance", "Finance", Banknote],
    ["/super-admin/support", "Support", LifeBuoy],
    ["/super-admin/businesses", "Clients", Building2]
  ],
  FINANCE_MANAGER: [
    ["/team/dashboard", "Dashboard", Home],
    ["/super-admin/finance", "Finance", Banknote],
    ["/super-admin/salaries", "Salaries", Banknote],
    ["/super-admin/subscriptions", "Subscriptions", ClipboardList]
  ],
  AR_MANAGER: [
    ["/team/dashboard", "Dashboard", Home],
    ["/super-admin/approvals", "Approvals", CheckSquare],
    ["/super-admin/products", "Products", Boxes],
    ["/super-admin/support", "Support", LifeBuoy]
  ],
  SUPPORT_STAFF: [
    ["/team/dashboard", "Dashboard", Home],
    ["/super-admin/support", "Support", LifeBuoy],
    ["/super-admin/businesses", "Clients", Building2],
    ["/super-admin/products", "Products", Boxes]
  ],
  BUSINESS_OWNER: [
    ["/business/dashboard", "Dashboard", Home],
    ["/business/profile", "Profile", Store],
    ["/business/products", "Products", Boxes],
    ["/business/qrs", "QR Center", QrCode],
    ["/business/tables", "Tables", ClipboardList],
    ["/business/campaigns", "Campaigns", ClipboardList],
    ["/business/staff", "Staff", Users],
    ["/business/analytics", "Analytics", BarChart3],
    ["/business/settings", "Settings", Settings]
  ],
  BUSINESS_MANAGER: [
    ["/business/dashboard", "Dashboard", Home],
    ["/business/products", "Products", Boxes],
    ["/business/qrs", "QR Center", QrCode],
    ["/business/tables", "Tables", ClipboardList],
    ["/business/campaigns", "Campaigns", ClipboardList],
    ["/business/analytics", "Analytics", BarChart3]
  ],
  BUSINESS_STAFF: [
    ["/staff/dashboard", "Dashboard", Home],
    ["/staff/products", "Products", Boxes],
    ["/staff/leads", "Leads", ClipboardList],
    ["/staff/qrs", "QRs", QrCode]
  ],
  STAFF: [
    ["/staff/dashboard", "Dashboard", Home],
    ["/staff/products", "Products", Boxes],
    ["/staff/leads", "Leads", ClipboardList],
    ["/staff/qrs", "QRs", QrCode]
  ]
};

export function DashboardShell({ role, title, children }) {
  return (
    <main className="min-h-screen bg-surface lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white"><QrCode size={20} /></div>
          <div>
            <p className="font-black">AR Design Studio</p>
            <p className="text-xs font-bold text-brand">Scan. View. Experience. Order.</p>
          </div>
        </Link>
        <nav className="mt-8 grid gap-2">
          {(nav[role] || []).map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{role.replace("_", " ")}</p>
            <h1 className="text-2xl font-black">{title}</h1>
          </div>
          <LogoutButton />
        </header>
        <div className="p-5">{children}</div>
      </section>
    </main>
  );
}
