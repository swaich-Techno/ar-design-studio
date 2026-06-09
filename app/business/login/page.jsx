import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function BusinessLoginPage() {
  return (
    <AuthShell eyebrow="Business owner workspace">
      <AuthForm role="BUSINESS_OWNER" allowedRoles={["BUSINESS_OWNER", "BUSINESS_MANAGER"]} title="Business login" subtitle="Manage your catalogue, QR codes, AR products, staff, and analytics." loginPath="/business/dashboard" />
      <p className="mt-5 text-center text-sm font-semibold text-slate-600">Need an account? <Link className="text-brand" href="/business/register">Register business</Link></p>
    </AuthShell>
  );
}
