import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#080809] px-5 text-[#f3efe6]">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9b9589]">Not found</p>
        <h1 className="mt-3 text-3xl font-bold">This page is not available.</h1>
        <p className="mt-3 text-sm text-[#9b9589]">The menu, demo, or dashboard link may have moved.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[#d4b36a] px-5 text-sm font-semibold text-black">
            Home
          </Link>
          <Link href="/ar/demo" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm">
            Experience the menu
          </Link>
        </div>
      </div>
    </main>
  );
}
