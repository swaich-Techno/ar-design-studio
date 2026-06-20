import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600">
          <ShieldAlert />
        </div>
        <h1 className="mt-6 text-3xl font-black">Unauthorized access</h1>
        <p className="mt-3 leading-7 text-slate-600">This area is private. Use the correct login page for your role.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/business/login" variant="accent">Business login</Button>
          <Button href="/" variant="light">Home</Button>
        </div>
      </div>
    </main>
  );
}
