import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/redesign/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none min-h-11 px-5",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--fg)] text-[#111] hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)]",
        ghost:
          "bg-transparent text-[var(--fg)] border border-white/15 hover:border-white/40 hover:bg-white/5",
        gold: "bg-[var(--gold)] text-[#1a1206] hover:bg-[var(--champagne)]",
        accent:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]",
      },
      size: {
        default: "h-11",
        lg: "h-12 px-6 text-[0.95rem]",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
