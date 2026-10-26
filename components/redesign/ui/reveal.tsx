"use client";

import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`reveal-line ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

export function InViewReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
