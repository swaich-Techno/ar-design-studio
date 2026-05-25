import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function StaffLoginPage() {
  return (
    <AuthShell eyebrow="Staff operations">
      <AuthForm role="STAFF" allowedRoles={["BUSINESS_MANAGER", "BUSINESS_STAFF", "STAFF"]} title="Staff / Manager login" subtitle="Access assigned products, QR links, and lead activity only." loginPath="/staff/dashboard" />
    </AuthShell>
  );
}
