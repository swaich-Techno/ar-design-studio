import { AuthForm } from "@/components/forms/AuthForm";
import { AuthShell } from "@/components/forms/AuthShell";

export default function StaffLoginPage() {
  return (
    <AuthShell eyebrow="Staff operations">
      <AuthForm role="STAFF" title="Staff / Manager login" subtitle="Access assigned products, QR links, and lead activity only." loginPath="/staff/dashboard" />
    </AuthShell>
  );
}
