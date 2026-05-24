"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const industries = ["Sweet shops", "Restaurants", "Cafes", "Furniture showrooms", "Jewellery stores", "Real estate", "Boutiques", "Automobile dealers", "Gift shops", "Event planners", "Local shops"];

export function BusinessRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    whatsapp: "",
    category: "Restaurants",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Registration failed.");
      return;
    }
    router.push("/business/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <h1 className="text-3xl font-black">Register business</h1>
        <p className="mt-1 font-semibold text-slate-600">Create a business owner account. Role is assigned securely by the server.</p>
      </div>
      <input className="field" placeholder="Business name" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} required />
      <input className="field" placeholder="Owner name" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} required />
      <div className="grid gap-4 md:grid-cols-2">
        <input className="field" placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className="field" placeholder="WhatsApp number" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} required />
      </div>
      <select className="field" value={form.category} onChange={(e) => update("category", e.target.value)}>
        {industries.map((industry) => <option key={industry}>{industry}</option>)}
      </select>
      <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
      <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={loading}>{loading ? "Creating account..." : "Create Business Account"}</Button>
    </form>
  );
}
