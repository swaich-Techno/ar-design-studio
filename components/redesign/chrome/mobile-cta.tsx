"use client";

import Link from "next/link";
import { Button } from "@/components/redesign/ui/button";
import { site, waLink } from "@/lib/redesign/site";

export function MobileCta({ ar }: { ar: boolean }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <div className="optical-glass flex items-center justify-between gap-3 rounded-full px-2 py-2">
        {ar ? (
          <>
            <Button asChild size="sm" variant="gold" className="flex-1">
              <Link href="/ar/demo">Experience the menu</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="flex-1">
              <a href={waLink(site.whatsapp.ar, "Hi — I want a B Socio AR demo.")}>WhatsApp</a>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="sm" className="flex-1">
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="flex-1">
              <Link href="/ar">Explore AR</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
