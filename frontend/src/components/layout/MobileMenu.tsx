"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useLenis } from "@/lib/animations/SmoothScroll";
import { cn, pad, telHref } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { HeaderProps } from "./types";

type Props = HeaderProps & { open: boolean; onClose: () => void; isActive: (href: string) => boolean };

const ease = [0.76, 0, 0.24, 1] as const;

export function MobileMenu({ open, onClose, isActive, nav, cta, email, phone, socials, locale, labels }: Props) {
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const previous = document.activeElement as HTMLElement | null;
    const body = document.body.style;
    const overflow = body.overflow;
    body.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a[href]")?.focus(), 350);

    return () => {
      lenis?.start();
      body.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      previous?.focus?.();
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={labels.primary}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-[var(--header-h)] lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease }}
          data-lenis-prevent
        >
          <div className="container-site flex flex-1 flex-col justify-between gap-12 py-10">
            <nav aria-label={labels.primary}>
              <ul className="flex flex-col">
                {[...nav, cta].map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "flex items-baseline gap-5 py-4 font-display text-4xl font-bold tracking-tight transition-colors sm:text-5xl",
                          isActive(item.href) ? "text-lavender" : "text-paper hover:text-lavender",
                        )}
                      >
                        <span className="text-xs font-medium text-mute">{pad(i + 1)}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="flex flex-col gap-6 text-paper/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex flex-col gap-1 text-lg">
                {email && (
                  <a href={`mailto:${email}`} className="hover:text-lavender">
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={telHref(phone)} dir="ltr" className="hover:text-lavender rtl:text-end">
                    {phone}
                  </a>
                )}
              </div>
              <div className="flex items-center justify-between">
                <ul className="flex gap-3">
                  {socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-lavender hover:text-lavender"
                      >
                        <SocialIcon platform={s.platform} className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
                <LanguageSwitcher locale={locale} label={labels.switchLanguage} className="text-paper" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
