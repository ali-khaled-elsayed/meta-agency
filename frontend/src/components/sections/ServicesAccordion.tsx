"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type CSSProperties, useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import type { Service } from "@/lib/api/types";
import { cn, pad } from "@/lib/utils";

type Props = {
  services: (Service & { href: string })[];
  learnMore: string;
  /** `feature`: large numbered rows with an image, first row open. `list`: compact rows, all collapsed. */
  variant?: "feature" | "list";
};

/** Service list where one row at a time expands to show its summary. */
export function ServicesAccordion({ services, learnMore, variant = "feature" }: Props) {
  const list = variant === "list";
  const [open, setOpen] = useState<number | null>(list ? null : (services[0]?.id ?? null));
  const reduce = useReducedMotion();

  return (
    <ul className={cn(!list && "border-t border-line")}>
      {services.map((service, i) => {
        const isOpen = open === service.id;
        const panelId = `service-panel-${variant}-${service.id}`;
        return (
          <li
            key={service.id}
            className={cn(list ? "slide-in" : "fade-in", "relative border-b border-line")}
            style={
              list
                ? ({ "--slide-x": i % 2 === 0 ? "-14vw" : "14vw" } as CSSProperties)
                : ({ "--fade-shift": `${Math.min(i, 5) * 4}%` } as CSSProperties)
            }
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : service.id)}
                className={cn(
                  "group relative flex w-full items-center gap-6 overflow-hidden text-start md:gap-10",
                  list ? "py-6 md:py-7" : "py-7 md:py-9",
                )}
              >
                {!list && (
                  <>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 origin-bottom bg-lavender/[0.06] transition-transform duration-700 ease-[var(--ease-expo)]",
                        isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
                      )}
                    />
                    <span className="relative w-10 font-display text-sm tabular-nums text-lavender md:w-16 md:text-base">{pad(i + 1)}</span>
                  </>
                )}
                <span
                  className={cn(
                    "relative flex-1 font-display tracking-tight transition-[translate,color] duration-500 ease-[var(--ease-expo)]",
                    "group-hover:translate-x-3 rtl:group-hover:-translate-x-3",
                    list ? "text-xl md:text-3xl" : "text-2xl font-bold md:text-5xl",
                    list && (isOpen ? "text-lavender" : "group-hover:text-lavender"),
                  )}
                >
                  {service.title}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative flex shrink-0 items-center justify-center transition-all duration-500 ease-[var(--ease-expo)]",
                    list
                      ? cn("h-8 w-8", isOpen ? "rotate-[135deg] text-lavender" : "text-paper/80 group-hover:rotate-90 group-hover:text-lavender")
                      : cn(
                          "h-12 w-12 rounded-full border md:h-14 md:w-14",
                          isOpen ? "rotate-45 border-lavender bg-lavender text-ink" : "border-line text-paper/70 group-hover:border-lavender",
                        ),
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            {list && (
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-px h-px origin-left bg-lavender transition-transform duration-700 ease-[var(--ease-expo)] rtl:origin-right",
                  isOpen ? "scale-x-100" : "scale-x-0",
                )}
              />
            )}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn("grid gap-8 pb-10 md:grid-cols-12", !list && "md:ps-[6.5rem]")}>
                    <motion.div
                      initial={reduce ? false : { y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={list ? "md:col-span-10" : "md:col-span-7"}
                    >
                      {service.excerpt && <p className="text-lg leading-relaxed text-paper/70">{service.excerpt}</p>}
                      <Link
                        href={service.href}
                        className="group/link mt-6 inline-flex items-center gap-3 text-sm font-semibold text-lavender"
                      >
                        {learnMore}
                        <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 rtl:rotate-180 rtl:group-hover/link:-translate-x-1" />
                      </Link>
                    </motion.div>
                    {!list && service.image && (
                      <motion.div
                        initial={reduce ? false : { clipPath: "inset(0 0 100% 0 round 1rem)" }}
                        animate={{ clipPath: "inset(0 0 0% 0 round 1rem)" }}
                        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-[16/10] overflow-hidden rounded-2xl md:col-span-5"
                      >
                        <Image src={service.image} alt="" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
