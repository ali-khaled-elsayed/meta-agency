"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Desktop-only cursor: a dot plus a trailing ring that expands over interactive elements.
 * Elements can set `data-cursor="Label"` to show a label inside the ring.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setEnabled(fine.matches && !reduce);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor], input, textarea, select, label");
      setHovering(!!target);
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hovering ? 56 : 36;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender"
        style={{ x, y }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-lavender/70 text-[0.7rem] font-semibold uppercase tracking-widest text-ink mix-blend-normal"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(184,169,254,1)" : "rgba(184,169,254,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {label}
      </motion.div>
    </div>
  );
}
