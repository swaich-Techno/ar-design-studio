import Link from "next/link";
import { BusinessRegisterForm } from "@/components/forms/BusinessRegisterForm";
import { AuthShell } from "@/components/forms/AuthShell";

export const metadata = {
  title: "Business Register | B Socio AR Studio",
  robots: { index: false, follow: false }
};

export default function BusinessRegisterPage() {
  return (
    <AuthShell eyebrow="Start your AR catalogue">
      <BusinessRegisterForm />
      <p className="mt-5 text-center text-sm font-semibold text-slate-600">Already registered? <Link className="text-brand" href="/business/login">Business login</Link></p>
    </AuthShell>
  );
}
