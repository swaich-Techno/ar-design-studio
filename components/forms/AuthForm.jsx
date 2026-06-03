"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AuthForm({ role, allowedRoles, title, subtitle, loginPath }) {
  const router = useRouter();
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, role, allowedRoles })
    });

    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Login failed.");
      return;
    }
    router.push(loginPath);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-1 font-semibold text-slate-600">{subtitle}</p>
      </div>
      <input className="field" type="email" placeholder="Email address" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} required />
      <input className="field" type="password" placeholder="Password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} required />
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      <Link className="text-center text-sm font-black text-brand" href={`/forgot-password?from=${encodeURIComponent(role || title || "login")}`}>
        Forgot password?
      </Link>
    </form>
  );
}
