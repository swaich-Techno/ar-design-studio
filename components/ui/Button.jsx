import Link from "next/link";

const variants = {
  primary: "bg-ink text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-xl",
  accent: "bg-brand text-white shadow-lg shadow-teal-950/20 hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-xl",
  gold: "bg-accent text-ink shadow-lg shadow-amber-950/20 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-xl",
  light: "border border-slate-200 bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-teal-200 hover:bg-slate-50",
  ghost: "bg-transparent text-ink hover:bg-slate-100",
  darkGhost: "border border-white/[0.15] bg-white/[0.08] text-white hover:-translate-y-0.5 hover:bg-white/[0.14]"
};

export function Button({ href, children, variant = "primary", className = "", ...props }) {
  const cls = `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transform-none ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
