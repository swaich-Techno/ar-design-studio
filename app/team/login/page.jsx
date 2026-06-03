import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function TeamLoginPage() {
  return (
    <AuthShell eyebrow="Internal team workspace">
      <AuthForm
        role="TEAM"
        allowedRoles={["TEAM_ADMIN", "FINANCE_MANAGER", "AR_MANAGER", "SUPPORT_STAFF"]}
        title="Team login"
        subtitle="For internal finance, AR approval, support, and operations team members."
        loginPath="/team/dashboard"
      />
    </AuthShell>
  );
}
