"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { duration, ease } from "./presets";

/**
 * Set after the first client commit. The initial page load is revealed by the preloader, so the curtain
 * only runs when the template remounts on client-side navigation (never during hydration).
 */
let hydrated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [animate] = useState(() => hydrated);

  useEffect(() => {
    hydrated = true;
  }, []);

  if (!animate || reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-lavender"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: duration.base, ease: ease.quart }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.expo, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
