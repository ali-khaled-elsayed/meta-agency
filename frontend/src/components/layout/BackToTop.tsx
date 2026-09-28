"use client";

import { useLenis } from "@/lib/animations/SmoothScroll";

export function BackToTop({ label }: { label: string }) {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group inline-flex items-center gap-2 transition-colors hover:text-lavender"
    >
      {label}
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-1" fill="none">
        <path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
