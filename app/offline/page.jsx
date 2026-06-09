import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-ink">
          <WifiOff />
        </div>
        <h1 className="mt-6 text-3xl font-black">You are offline</h1>
        <p className="mt-3 leading-7 text-slate-600">
          AR Design Studio needs internet for live products, QR pages, MongoDB data, Cloudinary images, and AR model files.
        </p>
        <Button href="/" variant="accent" className="mt-6">Try again</Button>
      </div>
    </main>
  );
}
