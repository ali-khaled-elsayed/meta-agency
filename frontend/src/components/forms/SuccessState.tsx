"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = { title: string; text: string; actionLabel?: string; onAction?: () => void };

export function SuccessState({ title, text, actionLabel, onAction }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="flex flex-col items-start gap-8 py-10 outline-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.div
        className="flex h-24 w-24 items-center justify-center rounded-full bg-lavender text-ink"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <div>
        <h2 className="text-display-md">{title}</h2>
        <p className="mt-4 max-w-lg text-lg text-paper/70">{text}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-lavender hover:text-lavender"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
