"use client";

import { useEffect, useState } from "react";

export function ApprovalManager() {
  const [data, setData] = useState({ products: [], campaigns: [] });

  async function load() {
    const response = await fetch("/api/approvals");
    const json = await response.json();
    setData(json || { products: [], campaigns: [] });
  }

  useEffect(() => { load(); }, []);

  async function act(targetType, targetId, action) {
    await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, action })
    });
    load();
  }

  const button = (label, action, type, id) => (
    <button onClick={() => act(type, id, action)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">{label}</button>
  );

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-black">Product approval queue</h2>
        <div className="mt-4 grid gap-3">
          {(data.products || []).map((product) => (
            <div key={product._id} className="rounded-[22px] border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black">{product.name}</p>
                  <p className="text-sm font-semibold text-slate-500">{product.businessId?.businessName} - {product.publicationStatus} - AR {product.arModelStatus}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {button("Approve & publish", "approve", "Product", product._id)}
                  {button("Reject", "reject", "Product", product._id)}
                  {button("Need optimization", "optimize", "Product", product._id)}
                  {button("Hide", "hide", "Product", product._id)}
                </div>
              </div>
            </div>
          ))}
          {!data.products?.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No product approvals pending.</p> : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-black">Campaign approval queue</h2>
        <div className="mt-4 grid gap-3">
          {(data.campaigns || []).map((campaign) => (
            <div key={campaign._id} className="rounded-[22px] border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black">{campaign.title}</p>
                  <p className="text-sm font-semibold text-slate-500">{campaign.businessId?.businessName} - {campaign.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {button("Approve live", "approve", "Campaign", campaign._id)}
                  {button("Reject", "reject", "Campaign", campaign._id)}
                  {button("Expire", "expire", "Campaign", campaign._id)}
                </div>
              </div>
            </div>
          ))}
          {!data.campaigns?.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No campaign approvals pending.</p> : null}
        </div>
      </section>
    </div>
  );
}
