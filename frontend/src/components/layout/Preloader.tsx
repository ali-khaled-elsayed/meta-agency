"use client";

import { useEffect, useState } from "react";

/**
 * Short spinner shown on every full page load while the first paint settles. Timing lives in CSS
 * (see `.preloader` in globals.css) so it plays before hydration; this only removes the faded overlay.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden className="preloader fixed inset-0 z-[90] flex items-center justify-center bg-ink">
      <span className="preloader-ring h-14 w-14 rounded-full border-2 border-lavender/15 border-t-lavender border-r-lavender" />
    </div>
  );
}
