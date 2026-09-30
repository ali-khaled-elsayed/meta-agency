import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** The slanted "M": left stroke, inner stem, middle stroke, right stem (traced from the brand icon). */
const PARTS = [
  "M186 0H276L90 465H0Z",
  "M211 0H290V465H211Z",
  "M408 0H490L304 465H222Z",
  "M425 0H504V465H425Z",
];

/**
 * Vector version of the Meta icon so each stroke can animate.
 * Animation is opt-in through the `logo-*` classes in globals.css on a parent element.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 506 465" className={cn("logo-mark", className)} aria-hidden>
      {PARTS.map((d, i) => (
        <g key={d} className="logo-bar-eq" style={{ "--bar": i } as CSSProperties}>
          <path className="logo-bar" d={d} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

const WORDMARK_SIZES = {
  md: "h-6 md:h-7",
  lg: "h-10 md:h-12",
  xl: "h-10 sm:h-14 md:h-20",
};

/** The "META™ AGENCY" wordmark, tinted with the current text colour. */
export function LogoLockup({ className, size = "md" }: { className?: string; size?: keyof typeof WORDMARK_SIZES }) {
  return (
    <span dir="ltr" className={cn("logo-anim inline-flex text-lavender", className)}>
      <span
        aria-hidden
        className={cn("logo-text block aspect-[1024/163] bg-current", WORDMARK_SIZES[size])}
        style={{
          maskImage: "url(/brand/wordmark.png)",
          WebkitMaskImage: "url(/brand/wordmark.png)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </span>
  );
}
