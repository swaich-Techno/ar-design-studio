import Link from "next/link";
import {
  BarChart3,
  Banknote,
  Boxes,
  Building2,
  CheckSquare,
  ClipboardList,
  Home,
  LifeBuoy,
  MessageCircle,
  QrCode,
  Settings,
  Shield,
  Sparkles,
  Store,
  UserCog,
  Users
} from "lucide-react";
import { LogoutButton } from "@/components/dashboards/LogoutButton";

const navGroups = {
  SUPER_ADMIN: [
    {
      title: "Command",
      items: [
        ["/super-admin/dashboard", "Dashboard", Shield],
        ["/super-admin/businesses", "Businesses", Building2],
        ["/super-admin/demo-requests", "Demo requests", Sparkles],
        ["/super-admin/approvals", "Approvals", CheckSquare],
        ["/super-admin/analytics", "Analytics", BarChart3],
        ["/super-admin/leads", "Leads", ClipboardList]
      ]
    },
    {
      title: "Operations",
      items: [
        ["/super-admin/products", "Products", Boxes],
        ["/super-admin/chat", "Client chat", MessageCircle],
        ["/super-admin/reports", "Reports", BarChart3],
        ["/super-admin/support", "Support", LifeBuoy]
      ]
    },
    {
      title: "Admin",
      items: [
        ["/super-admin/finance", "Finance", Banknote],
        ["/super-admin/salaries", "Salaries", Banknote],
        ["/super-admin/team", "Team", UserCog],
        ["/super-admin/users", "Users", Users],
        ["/super-admin/subscriptions", "Subscriptions", ClipboardList],
        ["/super-admin/audit-logs", "Audit logs", ClipboardList]
      ]
    }
  ],
  TEAM_ADMIN: [
    {
      title: "Team workspace",
      items: [
        ["/team/dashboard", "Dashboard", Home],
        ["/super-admin/demo-requests", "Demo requests", Sparkles],
        ["/super-admin/approvals", "Approvals", CheckSquare],
        ["/super-admin/businesses", "Clients", Building2],
        ["/super-admin/finance", "Finance", Banknote],
        ["/super-admin/support", "Support", LifeBuoy],
        ["/team/chat", "Client chat", MessageCircle]
      ]
    }
  ],
  FINANCE_MANAGER: [
    {
      title: "Finance desk",
      items: [
        ["/team/dashboard", "Dashboard", Home],
        ["/super-admin/finance", "Finance", Banknote],
        ["/super-admin/salaries", "Salaries", Banknote],
        ["/super-admin/subscriptions", "Subscriptions", ClipboardList],
        ["/team/chat", "Client chat", MessageCircle]
      ]
    }
  ],
  AR_MANAGER: [
    {
      title: "AR production",
      items: [
        ["/team/dashboard", "Dashboard", Home],
        ["/super-admin/demo-requests", "Demo requests", Sparkles],
        ["/super-admin/approvals", "Approvals", CheckSquare],
        ["/super-admin/products", "Products", Boxes],
        ["/super-admin/support", "Support", LifeBuoy],
        ["/team/chat", "Client chat", MessageCircle]
      ]
    }
  ],
  SUPPORT_STAFF: [
    {
      title: "Support desk",
      items: [
        ["/team/dashboard", "Dashboard", Home],
        ["/super-admin/support", "Support", LifeBuoy],
        ["/team/chat", "Client chat", MessageCircle],
        ["/super-admin/businesses", "Clients", Building2],
        ["/super-admin/products", "Products", Boxes]
      ]
    }
  ],
  BUSINESS_OWNER: [
    {
      title: "Growth",
      items: [
        ["/business/dashboard", "Dashboard", Home],
        ["/business/products", "Products", Boxes],
        ["/business/qrs", "QR Center", QrCode],
        ["/business/campaigns", "Campaigns", ClipboardList],
        ["/business/analytics", "Analytics", BarChart3],
        ["/business/leads", "Leads", ClipboardList]
      ]
    },
    {
      title: "Business",
      items: [
        ["/business/profile", "Profile", Store],
        ["/business/tables", "Tables", ClipboardList],
        ["/business/staff", "Staff", Users],
        ["/business/chat", "Team chat", MessageCircle],
        ["/business/reports", "Reports", BarChart3],
        ["/business/billing", "Billing", Banknote],
        ["/business/settings", "Settings", Settings]
      ]
    }
  ],
  BUSINESS_MANAGER: [
    {
      title: "Business workspace",
      items: [
        ["/business/dashboard", "Dashboard", Home],
        ["/business/products", "Products", Boxes],
        ["/business/qrs", "QR Center", QrCode],
        ["/business/tables", "Tables", ClipboardList],
        ["/business/campaigns", "Campaigns", ClipboardList],
        ["/business/chat", "Team chat", MessageCircle],
        ["/business/analytics", "Analytics", BarChart3],
        ["/business/leads", "Leads", ClipboardList],
        ["/business/reports", "Reports", BarChart3],
        ["/business/billing", "Billing", Banknote]
      ]
    }
  ],
  BUSINESS_STAFF: [
    {
      title: "Staff workspace",
      items: [
        ["/staff/dashboard", "Dashboard", Home],
        ["/staff/products", "Products", Boxes],
        ["/staff/leads", "Leads", ClipboardList],
        ["/staff/qrs", "QRs", QrCode]
      ]
    }
  ],
  STAFF: [
    {
      title: "Staff workspace",
      items: [
        ["/staff/dashboard", "Dashboard", Home],
        ["/staff/products", "Products", Boxes],
        ["/staff/leads", "Leads", ClipboardList],
        ["/staff/qrs", "QRs", QrCode]
      ]
    }
  ]
};

export function DashboardShell({ role, title, children }) {
  const groups = navGroups[role] || [];

  return (
    <main id="main-content" className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff,#f7f8fb_38%,#eef2ff)] lg:grid lg:grid-cols-[292px_1fr]">
      <aside className="border-r border-slate-200 bg-white/90 p-5 backdrop-blur">
        <Link href="/" className="flex items-center gap-3 rounded-[24px] bg-ink p-3 text-white shadow-soft">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white"><QrCode size={20} /></div>
          <div>
            <p className="font-black">AR Design Studio</p>
            <p className="text-xs font-bold text-teal-100">Scan. View. Experience. Order.</p>
          </div>
        </Link>
        <nav className="mt-8 grid gap-6">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{group.title}</p>
              <div className="mt-2 grid gap-1">
                {group.items.map(([href, label, Icon]) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-teal-50 hover:text-brand">
                    <Icon size={18} /> {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <section>
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-white/85 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">{role.replaceAll("_", " ")}</p>
            <h1 className="text-2xl font-black text-ink">{title}</h1>
          </div>
          <LogoutButton />
        </header>
        <div className="p-5 lg:p-7">{children}</div>
      </section>
    </main>
  );
}
