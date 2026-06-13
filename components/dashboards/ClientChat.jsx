"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function ClientChat({ internal = false }) {
  const [businesses, setBusinesses] = useState([]);
  const [business, setBusiness] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [viewerType, setViewerType] = useState(internal ? "INTERNAL" : "CLIENT");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const load = useCallback(async (nextBusinessId = selectedBusinessId) => {
    setError("");
    const query = nextBusinessId ? `?businessId=${encodeURIComponent(nextBusinessId)}` : "";
    const response = await fetch(`/api/chat${query}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Chat could not be loaded.");
      setLoading(false);
      return;
    }
    setViewerType(data.viewerType || (internal ? "INTERNAL" : "CLIENT"));
    setBusinesses(data.businesses || []);
    setBusiness(data.business || null);
    setMessages(data.messages || []);
    if (internal && !selectedBusinessId && data.business?._id) setSelectedBusinessId(data.business._id);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  }, [internal, selectedBusinessId]);

  useEffect(() => { load(selectedBusinessId); }, [load, selectedBusinessId]);

  async function submit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError("");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: selectedBusinessId || business?._id, message })
    });
    const data = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) {
      setError(data.error || "Message could not be sent.");
      return;
    }
    setMessage("");
    setMessages((current) => [...current, data.message]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  }

  if (loading) return <p className="font-bold text-slate-600">Loading chat...</p>;

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">{internal ? "Client selector" : "Support chat"}</p>
        <h2 className="mt-2 text-2xl font-black">{internal ? "Client conversations" : "Message AR Design Studio"}</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          {internal ? "Choose a client and keep all support, AR, billing, and setup messages inside the dashboard." : "Chat with the internal AR Design Studio team without leaving the app."}
        </p>
        {internal ? (
          <select className="field mt-5" value={selectedBusinessId} onChange={(event) => setSelectedBusinessId(event.target.value)}>
            {businesses.map((item) => (
              <option key={item._id} value={item._id}>{item.businessName}</option>
            ))}
          </select>
        ) : null}
        {business ? (
          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <p className="font-black">{business.businessName}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">/{business.slug} - {business.subscriptionPlan || "Plan not set"}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${business.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {business.isActive ? "Active client" : "Inactive client"}
            </p>
          </div>
        ) : null}
      </aside>

      <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-sm font-bold text-slate-500">In-app client chat</p>
          <h3 className="text-xl font-black">{business?.businessName || "No client selected"}</h3>
        </div>
        {error ? <p className="m-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</p> : null}
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
          {!messages.length ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-lg font-black">No messages yet</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">Start the conversation here and keep the full history with this client.</p>
              </div>
            </div>
          ) : null}
          {messages.map((item) => {
            const mine = item.senderType === viewerType;
            return (
              <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm ${mine ? "bg-ink text-white" : "bg-white text-ink"}`}>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-black opacity-75">
                    <span>{item.senderName}</span>
                    <span>{item.senderRole?.replaceAll("_", " ")}</span>
                    <span>{formatTime(item.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm font-semibold leading-6">{item.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={submit} className="grid gap-3 border-t border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
          <textarea className="field min-h-20" placeholder="Type message..." value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button type="submit" variant="accent" disabled={sending || !business}>{sending ? "Sending..." : "Send"}</Button>
        </form>
      </section>
    </div>
  );
}
