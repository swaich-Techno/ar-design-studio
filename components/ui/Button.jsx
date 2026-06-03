import Link from "next/link";

const variants = {
  primary: "bg-ink text-white hover:bg-slate-800",
  accent: "bg-brand text-white hover:bg-teal-700",
  light: "bg-white text-ink hover:bg-slate-50 border border-slate-200",
  ghost: "bg-transparent text-ink hover:bg-slate-100"
};

export function Button({ href, children, variant = "primary", className = "", ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${variants[variant]} ${className}`;
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
