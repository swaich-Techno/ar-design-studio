import { Suspense } from "react";
import { AuthShell } from "@/components/forms/AuthShell";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | B Socio AR Studio",
  robots: { index: false, follow: false }
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Secure account recovery">
      <Suspense fallback={<p className="font-bold text-slate-600">Loading recovery form...</p>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
