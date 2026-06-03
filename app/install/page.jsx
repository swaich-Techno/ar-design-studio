import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-surface px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Button href="/" variant="ghost">Back</Button>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-black text-brand">
              <Download size={16} /> Installable mobile app
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Install AR Design Studio on Android and iPhone.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Admins, business owners, and staff can install the SaaS dashboard as a PWA. Public customers still scan QR codes and open browser pages without installing anything.
            </p>
          </div>
          <Card>
            <Smartphone className="text-brand" size={42} />
            <h2 className="mt-5 text-2xl font-black">Mobile install steps</h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">Android Chrome</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Open the website, tap the browser menu, then tap Install app or Add to Home screen.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">iPhone Safari</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Open the website in Safari, tap Share, then tap Add to Home Screen.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
