"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

/** Soft lavender light fields that drift with the pointer and sink on scroll. Decorative only. */
export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 20 });
  const y = useSpring(my, { stiffness: 40, damping: 20 });
  const invX = useTransform(x, (v) => -v * 0.6);
  const invY = useTransform(y, (v) => -v * 0.6);
  const { scrollY } = useScroll();
  const sink = useTransform(scrollY, [0, 800], [0, 220]);
  const fade = useTransform(scrollY, [0, 700], [1, 0.2]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 80);
      my.set((e.clientY / window.innerHeight - 0.5) * 80);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ y: sink, opacity: fade }}>
      <motion.div
        className="absolute -top-[20%] end-[-10%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,169,254,0.35),transparent_60%)] blur-3xl"
        style={{ x, y }}
      />
      <motion.div
        className="absolute bottom-[-30%] start-[-15%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,108,242,0.28),transparent_60%)] blur-3xl"
        style={{ x: invX, y: invY }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ink))]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 25vh",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
    </motion.div>
  );
}
