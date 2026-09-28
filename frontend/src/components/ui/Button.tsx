import Link from "next/link";
import type { ReactNode } from "react";
import { MagneticButton } from "@/lib/animations/MagneticButton";
import { isExternal } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "dark";

const variants: Record<Variant, string> = {
  primary: "bg-lavender text-ink hover:bg-paper",
  outline: "border border-current/30 text-current hover:border-lavender hover:bg-lavender hover:text-ink",
  ghost: "text-current hover:text-lavender",
  dark: "bg-ink text-paper hover:bg-lavender-deep",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-4 w-4 rtl:-scale-x-100", className)}>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({ href, children, variant = "primary", className, magnetic = true, arrow = true }: Props) {
  const external = isExternal(href);
  const classes = cn(
    "group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold transition-colors duration-300",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="relative flex h-4 w-4 overflow-hidden">
          <ArrowIcon className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-5 rtl:group-hover:-translate-x-5" />
          <ArrowIcon className="absolute -translate-x-5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 rtl:translate-x-5" />
        </span>
      )}
    </>
  );

  const link = external ? (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );

  return magnetic ? <MagneticButton>{link}</MagneticButton> : link;
}
