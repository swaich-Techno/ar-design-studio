import { DashboardShell } from "@/components/dashboards/DashboardShell";

export default function BusinessSettingsPage() {
  return (
    <DashboardShell role="BUSINESS_OWNER" title="Settings">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Account settings</h2>
        <p className="mt-2 text-slate-600">Manage billing, plan changes, and advanced integrations with Super Admin support.</p>
      </div>
    </DashboardShell>
  );
}
