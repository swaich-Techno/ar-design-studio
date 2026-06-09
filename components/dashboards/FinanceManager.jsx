"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatGrid } from "@/components/dashboards/StatGrid";

export function FinanceManager() {
  const [data, setData] = useState({ payments: [], expenses: [], stats: {} });
  const [payment, setPayment] = useState({ invoiceNumber: "", description: "", amount: "", type: "MONTHLY", status: "PENDING", dueDate: "", paymentMethod: "" });
  const [expense, setExpense] = useState({ recordType: "expense", title: "", category: "CLOUDINARY", amount: "", expenseDate: "", notes: "" });

  async function load() {
    const response = await fetch("/api/finance");
    const json = await response.json();
    setData(json || { payments: [], expenses: [], stats: {} });
  }

  useEffect(() => { load(); }, []);

  async function submitPayment(event) {
    event.preventDefault();
    await fetch("/api/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payment) });
    setPayment({ invoiceNumber: "", description: "", amount: "", type: "MONTHLY", status: "PENDING", dueDate: "", paymentMethod: "" });
    load();
  }

  async function submitExpense(event) {
    event.preventDefault();
    await fetch("/api/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(expense) });
    setExpense({ recordType: "expense", title: "", category: "CLOUDINARY", amount: "", expenseDate: "", notes: "" });
    load();
  }

  return (
    <div className="grid gap-6">
      <StatGrid items={[
        { label: "Monthly recurring", value: `Rs. ${data.stats?.monthlyRecurringRevenue || 0}` },
        { label: "Payments received", value: `Rs. ${data.stats?.paymentsReceived || 0}` },
        { label: "Outstanding", value: `Rs. ${data.stats?.outstanding || 0}` },
        { label: "Net profit estimate", value: `Rs. ${data.stats?.netProfitEstimate || 0}` }
      ]} />

      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submitPayment} className="grid gap-3 rounded-[26px] border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Manual payment / invoice</h2>
          <input className="field" placeholder="Invoice number" value={payment.invoiceNumber} onChange={(e) => setPayment({ ...payment, invoiceNumber: e.target.value })} />
          <input className="field" placeholder="Description" value={payment.description} onChange={(e) => setPayment({ ...payment, description: e.target.value })} />
          <input className="field" type="number" placeholder="Amount" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-3">
            <select className="field" value={payment.type} onChange={(e) => setPayment({ ...payment, type: e.target.value })}>
              {["SETUP", "MONTHLY", "ADDON", "SERVICE", "CUSTOM"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="field" value={payment.status} onChange={(e) => setPayment({ ...payment, status: e.target.value })}>
              {["PAID", "PENDING", "OVERDUE", "CANCELLED"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input className="field" type="date" value={payment.dueDate} onChange={(e) => setPayment({ ...payment, dueDate: e.target.value })} />
          </div>
          <Button type="submit" variant="accent">Add payment record</Button>
        </form>

        <form onSubmit={submitExpense} className="grid gap-3 rounded-[26px] border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Costing / expense</h2>
          <input className="field" placeholder="Expense title" value={expense.title} onChange={(e) => setExpense({ ...expense, title: e.target.value })} required />
          <input className="field" type="number" placeholder="Amount" value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="field" value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })}>
              {["CLOUDINARY", "VERCEL", "MODEL_PRODUCTION", "SALARY", "SOFTWARE", "MARKETING", "OTHER"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input className="field" type="date" value={expense.expenseDate} onChange={(e) => setExpense({ ...expense, expenseDate: e.target.value })} />
          </div>
          <Button type="submit">Add cost</Button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[26px] border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Recent payments</h2>
          <div className="mt-4 grid gap-3">
            {(data.payments || []).slice(0, 10).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold">
                {item.invoiceNumber} - Rs. {item.amount} - {item.status}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[26px] border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Recent costs</h2>
          <div className="mt-4 grid gap-3">
            {(data.expenses || []).slice(0, 10).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold">
                {item.title} - Rs. {item.amount} - {item.category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
