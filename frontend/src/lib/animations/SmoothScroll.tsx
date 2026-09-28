"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
 * Disabled for reduced-motion users and touch devices, which keep native scrolling and never download either library.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([import("lenis"), import("./gsap")]).then(([{ default: LenisClass }, { getGsap }]) => {
      if (cancelled) return;
      const { gsap, ScrollTrigger } = getGsap();
      const instance = new LenisClass({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
      cleanup = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    lenis.scrollTo(0, { immediate: true });
    void import("./gsap").then(({ getGsap }) => getGsap().ScrollTrigger.refresh());
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
