import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function StaffLoginPage() {
  return (
    <AuthShell eyebrow="Internal team access">
      <AuthForm
        role="TEAM"
        allowedRoles={["TEAM_ADMIN", "FINANCE_MANAGER", "AR_MANAGER", "SUPPORT_STAFF"]}
        title="AR Design Studio staff login"
        subtitle="For you and your internal team only. Client owners and managers should use Business login."
        loginPath="/team/dashboard"
      />
    </AuthShell>
  );
}
