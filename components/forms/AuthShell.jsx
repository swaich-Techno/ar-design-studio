import { ScanLine } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AuthShell({ eyebrow, children }) {
  return (
    <main className="grid min-h-screen bg-surface px-5 py-8 lg:grid-cols-[0.92fr_1.08fr]">
      <section className="hidden rounded-[36px] bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink">
            <ScanLine />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-teal-200">{eyebrow}</p>
          <h2 className="mt-4 text-5xl font-black leading-tight">Scan. View. Experience. Order.</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-slate-300">Role-specific access keeps public customers away from private data while businesses manage QR, AR, WhatsApp leads, and analytics.</p>
      </section>
      <section className="grid place-items-center">
        <Card className="w-full max-w-xl">{children}</Card>
      </section>
    </main>
  );
}
