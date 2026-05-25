"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatGrid } from "@/components/dashboards/StatGrid";

export function SalaryManager() {
  const [data, setData] = useState({ salaries: [], team: [], stats: {} });
  const [form, setForm] = useState({ employeeName: "", role: "", month: "", baseSalary: "", bonus: "", deductions: "", status: "PENDING", notes: "" });

  async function load() {
    const response = await fetch("/api/salaries");
    const json = await response.json();
    setData(json || { salaries: [], team: [], stats: {} });
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/salaries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ employeeName: "", role: "", month: "", baseSalary: "", bonus: "", deductions: "", status: "PENDING", notes: "" });
    load();
  }

  return (
    <div className="grid gap-6">
      <StatGrid items={[
        { label: "Salary pending", value: `Rs. ${data.stats?.pending || 0}` },
        { label: "Salary paid", value: `Rs. ${data.stats?.paid || 0}` },
        { label: "Salary records", value: data.stats?.count || 0 }
      ]} />

      <form onSubmit={submit} className="grid gap-4 rounded-[26px] border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">Add salary record</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="field" placeholder="Employee name" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} required />
          <input className="field" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <input className="field" placeholder="Month e.g. 2026-05" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {["PENDING", "PAID", "HOLD"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="field" type="number" placeholder="Base salary" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} required />
          <input className="field" type="number" placeholder="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
          <input className="field" type="number" placeholder="Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
          <input className="field" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <Button type="submit" variant="accent">Save salary</Button>
      </form>

      <div className="grid gap-3">
        {(data.salaries || []).map((salary) => (
          <div key={salary._id} className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black">{salary.employeeName}</p>
                <p className="text-sm font-semibold text-slate-500">{salary.role || "Team"} - {salary.month}</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold">{salary.status}</p>
            </div>
            <p className="mt-2 text-sm font-bold">Net salary: Rs. {salary.netSalary || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
