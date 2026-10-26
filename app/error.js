"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function Error({ error, reset }) {
  const reference = useMemo(() => {
    const digest = String(error?.digest || "").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase();
    return digest ? `BS-${digest}` : "BS-ERR";
  }, [error]);

  useEffect(() => {
    console.error(JSON.stringify({ level: "error", errorRef: reference, digest: error?.digest || "" }));
  }, [error, reference]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#080809] px-5 text-[#f3efe6]">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9b9589]">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-bold">This page could not be loaded.</h1>
        <p className="mt-3 text-sm text-[#9b9589]">You can try again, or message us on WhatsApp if it keeps happening.</p>
        <p className="mt-4 font-mono text-sm text-[#d4b36a]">Error reference: {reference}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="min-h-11 rounded-full bg-[#d4b36a] px-5 text-sm font-semibold text-black">
            Try again
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
