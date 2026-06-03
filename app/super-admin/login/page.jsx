import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function SuperAdminLoginPage() {
  return (
    <AuthShell eyebrow="AR Design Studio control room">
      <AuthForm role="SUPER_ADMIN" title="Super Admin login" subtitle="Only environment-approved admin emails can sign in." loginPath="/super-admin/dashboard" />
    </AuthShell>
  );
}
