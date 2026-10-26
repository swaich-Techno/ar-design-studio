import Link from "next/link";
import { cn } from "@/lib/redesign/utils";

export function Logo({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="B Socio home"
    >
      <span className="relative grid h-8 w-8 place-items-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
          <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.55" />
          <path
            d="M11.2 22 V10 h6.1 c2.7 0 4.4 1.5 4.4 3.6 0 1.5-1 2.6-2.5 3.1 1.8.4 3 1.7 3 3.5 0 2.4-2 4.8-5.2 4.8H11.2zm3.1-7.3h2.7c1.3 0 2-.6 2-1.5s-.7-1.4-2-1.4h-2.7v2.9zm0 5.5h3.1c1.5 0 2.3-.7 2.3-1.7s-.8-1.6-2.3-1.6h-3.1v3.3z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.92rem] font-semibold tracking-[0.18em]">
          B SOCIO
        </span>
        {compact ? null : (
          <span className="mt-1 text-[0.58rem] uppercase tracking-[0.28em] text-muted">
            Be experienced
          </span>
        )}
      </span>
    </Link>
  );
}

export function ArLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="B Socio AR home">
      <span className="relative grid h-8 w-8 place-items-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
          <rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <path d="M8 12h3M8 8h7M20 8h4v4M24 20v4h-4M8 20v4h4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="3.2" fill="none" stroke="currentColor" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.92rem] font-semibold tracking-[0.18em]">
          B SOCIO AR
        </span>
        <span className="mt-1 text-[0.58rem] uppercase tracking-[0.22em] text-muted">
          Food AR
        </span>
      </span>
    </Link>
  );
}
