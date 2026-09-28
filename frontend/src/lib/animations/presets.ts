import type { Transition, Variants } from "motion/react";

export const ease = {
  expo: [0.19, 1, 0.22, 1] as const,
  quart: [0.76, 0, 0.24, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
};

export const duration = { fast: 0.4, base: 0.8, slow: 1.2, cinematic: 1.6 };

export const viewportOnce = { once: true, amount: 0.2 } as const;

export const reveal: Transition = { duration: duration.base, ease: ease.expo };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: reveal },
};

export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
