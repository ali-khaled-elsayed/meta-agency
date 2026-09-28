"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { LogoLockup } from "@/components/ui/LogoMark";
import { MagneticButton } from "@/lib/animations/MagneticButton";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import type { HeaderProps } from "./types";

export function Header(props: HeaderProps) {
  const { locale, siteName, homeHref, nav, cta, labels } = props;
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setCompact(y > 40);
    setHidden(y > 240 && y > previous && !open);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu when the route changes
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  const isActive = (href: string) =>
    pathname === href || (href.split("/").length > 2 && pathname.startsWith(`${href}/`));

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          compact && !open ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        <div
          className={cn(
            "container-site flex items-center justify-between gap-6 transition-[height] duration-500",
            compact ? "h-16 md:h-18" : "h-[var(--header-h)]",
          )}
        >
          <Link href={homeHref} aria-label={siteName} className="relative z-10 shrink-0">
            <LogoLockup name={siteName} className="logo-intro" />
          </Link>

          <nav aria-label={labels.primary} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "group relative block px-4 py-2 text-sm font-medium transition-colors",
                      isActive(item.href) ? "text-lavender" : "text-paper/80 hover:text-paper",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-expo)] rtl:origin-right",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-4">
            <LanguageSwitcher locale={locale} label={labels.switchLanguage} className="hidden text-paper md:flex" />
            <MagneticButton className="hidden md:inline-block">
              <Link
                href={cta.href}
                className="inline-flex items-center rounded-full bg-lavender px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                {cta.label}
              </Link>
            </MagneticButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full border border-line px-4 text-sm font-medium text-paper transition-colors hover:border-lavender lg:hidden"
            >
              <span>{open ? labels.close : labels.menu}</span>
              <span aria-hidden className="relative block h-2.5 w-5">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500",
                    open && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500",
                    open && "-translate-y-[4px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu {...props} open={open} onClose={close} isActive={isActive} />
    </>
  );
}
