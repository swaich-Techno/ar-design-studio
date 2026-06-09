"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const loginLinks = [
  ["Super Admin", "/super-admin/login"],
  ["Team", "/team/login"],
  ["Business", "/business/login"],
  ["Team Staff", "/staff/login"]
];

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "login";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: from })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Password reset request could not be sent.");
      return;
    }
    setEmail("");
    setMessage(data.message || "If this email exists, a password reset request has been sent to support.");
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <h1 className="text-3xl font-black">Forgot password</h1>
        <p className="mt-1 font-semibold text-slate-600">Enter your account email. Admin/support will verify and reset it safely.</p>
      </div>
      <input className="field" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>{loading ? "Sending request..." : "Send reset request"}</Button>
      <div className="flex flex-wrap justify-center gap-3 text-sm font-black text-brand">
        {loginLinks.map(([label, href]) => (
          <Link key={href} href={href}>{label} login</Link>
        ))}
      </div>
    </form>
  );
}
