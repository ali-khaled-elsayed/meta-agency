import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const BARS = [
  { x: 255, y: 318, h: 72 },
  { x: 338, y: 248, h: 142 },
  { x: 422, y: 114, h: 276 },
];

/**
 * Vector version of the Meta mark (lavender "M" + three rising bars) so each stroke can animate.
 * Animation is opt-in through the `logo-*` classes in globals.css on a parent element.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="104 108 372 290" className={cn("logo-mark", className)} aria-hidden>
      <path
        className="logo-m"
        d="M130 368V142L245 252L357 142"
        pathLength={1}
        fill="none"
        stroke="var(--color-lavender)"
        strokeWidth={46}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {BARS.map((bar, i) => (
        <g key={bar.x} className="logo-bar-eq" style={{ "--bar": i } as CSSProperties}>
          <rect className="logo-bar" x={bar.x} y={bar.y} width={46} height={bar.h} rx={23} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

const LOCKUP_SIZES = {
  md: { gap: "gap-2.5", mark: "h-9 md:h-11", first: "text-base md:text-lg", rest: "text-[0.7rem] md:text-[0.8rem]" },
  lg: { gap: "gap-3.5", mark: "h-14 md:h-16", first: "text-2xl md:text-[1.7rem]", rest: "text-[0.95rem] md:text-[1.1rem]" },
};

/** Animated lockup: the mark plus the agency name set in type. */
export function LogoLockup({ name, className, size = "md" }: { name: string; className?: string; size?: keyof typeof LOCKUP_SIZES }) {
  const [first, ...rest] = name.split(" ");
  const s = LOCKUP_SIZES[size];
  return (
    <span dir="ltr" className={cn("logo-anim flex items-center text-paper", s.gap, className)}>
      <LogoMark className={cn("w-auto", s.mark)} />
      <span className="logo-text flex flex-col font-display uppercase leading-[0.95]">
        <span className={cn("font-extrabold tracking-wide", s.first)}>{first}</span>
        {rest.length > 0 && <span className={cn("font-medium tracking-[0.06em] text-paper/85", s.rest)}>{rest.join(" ")}</span>}
      </span>
    </span>
  );
}
