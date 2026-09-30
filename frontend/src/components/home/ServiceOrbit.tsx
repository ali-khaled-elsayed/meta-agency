import type { CSSProperties, ReactNode } from "react";

/** One outline glyph per discipline the agency offers (24px grid, stroked). */
const ICONS: ReactNode[] = [
  // Strategic branding: tag
  <>
    <path d="M3 12V4h8l10 10-8 8L3 12z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </>,
  // Digital marketing: megaphone
  <>
    <path d="M3 10v4h4l8 5V5L7 10H3z" />
    <path d="M18 9a4 4 0 0 1 0 6" />
  </>,
  // Web & mobile apps: code
  <>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
  </>,
  // Content creation: pen
  <>
    <path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z" />
    <path d="M14 7l3 3" />
  </>,
  // Photography: camera
  <>
    <path d="M3 8h4l2-3h6l2 3h4v11H3z" />
    <circle cx="12" cy="13" r="3.5" />
  </>,
  // Design: palette
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8z" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="10" cy="7" r="1" />
    <circle cx="15" cy="7" r="1" />
  </>,
  // Social media: heart
  <>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
  </>,
  // Reputation: star
  <>
    <path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z" />
  </>,
  // Email marketing: envelope
  <>
    <path d="M3 6h18v12H3z" />
    <path d="M3 7l9 6 9-6" />
  </>,
  // SEO: magnifier
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </>,
  // Public relations: microphone
  <>
    <path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
  </>,
];

/**
 * Loader orbit: every service flies in from off-screen, circles the mark once while a dashed ring draws,
 * then spirals into the mark. Pure CSS (see `.orbit*` in globals.css) so it plays before hydration.
 */
export function ServiceOrbit() {
  return (
    <span aria-hidden className="orbit pointer-events-none absolute left-1/2 top-1/2 block h-0 w-0">
      <svg className="orbit-ring absolute left-1/2 top-1/2 h-[calc(var(--orbit-r)*2)] w-[calc(var(--orbit-r)*2)] -translate-x-1/2 -translate-y-1/2 overflow-visible" viewBox="0 0 100 100">
        <defs>
          <mask id="orbit-ring-mask">
            <circle className="orbit-ring-draw" cx="50" cy="50" r="49" pathLength="100" fill="none" stroke="#fff" strokeWidth="4" />
          </mask>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          className="stroke-lavender/50"
          strokeWidth="0.45"
          strokeDasharray="1.2 1.6"
          mask="url(#orbit-ring-mask)"
        />
      </svg>
      {ICONS.map((icon, i) => (
        <span
          key={i}
          className="orbit-slot absolute left-0 top-0 block"
          style={{ "--a": `${(i * 360) / ICONS.length}deg`, "--i": i } as CSSProperties}
        >
          <span className="orbit-fly block">
            <span className="orbit-icon block">
              <span className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-lavender/60 bg-ink/70 text-lavender backdrop-blur-sm sm:h-14 sm:w-14 md:h-[4.5rem] md:w-[4.5rem]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </span>
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
