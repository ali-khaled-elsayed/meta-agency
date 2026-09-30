import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { LogoLockup } from "@/components/ui/LogoMark";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { ArrowIcon } from "@/components/ui/Button";
import { AnimatedText } from "@/lib/animations/AnimatedText";
import { InView } from "@/lib/animations/InView";
import { MagneticButton } from "@/lib/animations/MagneticButton";
import type { SiteSettings } from "@/lib/api/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref, routes } from "@/lib/routes";
import { cn, telHref, whatsappHref } from "@/lib/utils";
import { BackToTop } from "./BackToTop";
import type { NavItem } from "./types";

type Props = { locale: Locale; settings: SiteSettings; dict: Dictionary; nav: NavItem[] };

const BUBBLE_SIZES = [
  "w-24 text-base md:w-[7.5rem] md:text-lg",
  "w-20 text-sm md:w-[6.25rem] md:text-base",
  "w-28 text-lg md:w-[8.25rem] md:text-xl",
  "w-20 text-sm md:w-24 md:text-base",
];

const PLATFORM_NAMES: Record<string, string> = { linkedin: "LinkedIn", youtube: "YouTube", tiktok: "TikTok", x: "X", twitter: "X", whatsapp: "WhatsApp" };
const platformName = (p: string) => PLATFORM_NAMES[p.toLowerCase()] ?? p.charAt(0).toUpperCase() + p.slice(1);

/** One labelled contact line; links get a hover arrow. */
function FooterRow({ label, href, external, children }: { label: string; href?: string; external?: boolean; children: ReactNode }) {
  const body = (
    <>
      <span className="text-eyebrow block text-[0.65rem] text-paper/40">{label}</span>
      <span className="mt-1.5 flex items-center justify-between gap-4 text-base text-paper md:text-lg">
        {children}
        {href && (
          <ArrowIcon className="shrink-0 -rotate-45 text-lavender opacity-0 transition-[opacity,translate] duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
        )}
      </span>
    </>
  );
  return (
    <div className="border-b border-line py-4 first:pt-0">
      {href ? (
        <a
          href={href}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          className="group block [&>span:last-child]:transition-colors [&:hover>span:last-child]:text-lavender"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

export function Footer({ locale, settings, dict, nav }: Props) {
  const href = (path: string) => localizeHref(locale, path);
  const siteName = settings.site_name ?? "Meta Egypt Agency";
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2 text-paper">
      <div className="container-site pt-24 md:pt-32">
        <div className="flex flex-col gap-10 border-b border-line pb-20 md:pb-28">
          <p className="text-eyebrow text-lavender">{dict.footer.letsTalk}</p>
          {settings.footer_cta && <AnimatedText as="p" text={settings.footer_cta} className="text-display-xl max-w-[14ch]" />}
          <div className="flex flex-wrap items-center gap-6">
            <MagneticButton>
              <Link
                href={href(routes.contact)}
                className="group inline-flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-full bg-lavender text-sm font-semibold text-ink transition-transform duration-500 hover:scale-105 md:h-40 md:w-40"
                data-cursor={dict.nav.contact}
              >
                {dict.nav.contact}
                <ArrowIcon className="-rotate-45 rtl:rotate-45" />
              </Link>
            </MagneticButton>
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-display text-2xl font-semibold tracking-tight underline decoration-line decoration-1 underline-offset-8 transition-colors hover:text-lavender hover:decoration-lavender md:text-4xl"
              >
                {settings.contact_email}
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href={href(routes.home)} aria-label={siteName} className="inline-block">
              <InView as="span" className="logo-onview block">
                <LogoLockup size="lg" />
              </InView>
            </Link>
            {settings.tagline && <p className="mt-6 max-w-sm leading-relaxed text-paper/60">{settings.tagline}</p>}
            {settings.social_links.length > 0 && (
              <div className="mt-10">
                <h2 className="text-eyebrow mb-4 text-paper/50">{dict.common.followUs}</h2>
                <ul className="flex flex-wrap gap-2.5">
                  {settings.social_links.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 rounded-full border border-line py-2 pe-4 ps-2 transition-colors duration-300 hover:border-lavender hover:bg-lavender hover:text-ink"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-3 text-paper transition-colors duration-300 group-hover:bg-ink group-hover:text-lavender">
                          <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                        </span>
                        <span className="relative block h-5 overflow-hidden text-sm font-medium">
                          <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
                            {platformName(s.platform)}
                          </span>
                          <span aria-hidden className="absolute inset-x-0 top-full block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
                            {platformName(s.platform)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <nav aria-label={dict.footer.explore} className="lg:col-span-5">
            <h2 className="text-eyebrow mb-6 text-paper/50">{dict.footer.explore}</h2>
            <ul className="flex flex-wrap items-center gap-2 md:gap-3">
              {nav.map((item, i) => (
                <li key={item.href} className={cn("bubble-float", i % 3 === 1 && "mt-8", i % 3 === 2 && "-mt-4")} style={{ "--i": i } as CSSProperties}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex aspect-square items-center justify-center rounded-full border border-lavender/25 bg-[radial-gradient(circle_at_30%_25%,rgb(187_169_255/0.18),rgb(27_27_34/0.6)_60%)] px-3 text-center font-display font-semibold tracking-tight text-paper/90 shadow-[inset_0_1px_8px_rgb(255_255_255/0.06)] transition-[scale,background-color,color,border-color] duration-500 ease-[var(--ease-expo)] hover:scale-110 hover:border-lavender hover:bg-lavender hover:bg-none hover:text-ink",
                      BUBBLE_SIZES[i % BUBBLE_SIZES.length],
                    )}
                  >
                    <span aria-hidden className="absolute left-[22%] top-[16%] h-[14%] w-[22%] rotate-[-30deg] rounded-full bg-white/15 blur-[1px] transition-opacity group-hover:opacity-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-eyebrow mb-4 text-paper/50">{dict.footer.contact}</h2>
            <address className="not-italic">
              {settings.offices.map((office) => (
                <FooterRow key={office.id} label={office.name ?? dict.common.offices}>
                  {office.address && <span className="text-paper/70">{office.address}</span>}
                </FooterRow>
              ))}
              {settings.contact_phone && (
                <FooterRow label={dict.form.phone} href={telHref(settings.contact_phone)}>
                  <span dir="ltr">{settings.contact_phone}</span>
                </FooterRow>
              )}
              {settings.whatsapp_number && (
                <FooterRow label={dict.common.whatsapp} href={whatsappHref(settings.whatsapp_number)} external>
                  <span dir="ltr">{settings.whatsapp_number}</span>
                </FooterRow>
              )}
              {settings.working_hours && (
                <FooterRow label={dict.common.workingHours}>
                  <span className="text-paper/70">{settings.working_hours}</span>
                </FooterRow>
              )}
            </address>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-line py-8 text-sm text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteName}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-8">
            <Link href={href(routes.privacy)} className="transition-colors hover:text-lavender">
              {dict.footer.privacy}
            </Link>
            <BackToTop label={dict.common.backToTop} />
          </div>
        </div>
      </div>
      <InView
        threshold={0.2}
        className="wordmark-rise pointer-events-none flex select-none justify-center whitespace-nowrap font-display text-[22vw] font-bold leading-[0.75] tracking-tighter text-paper/[0.04]"
      >
        {"META".split("").map((letter, i) => (
          <span key={i} aria-hidden className="inline-block" style={{ "--i": i } as CSSProperties}>
            {letter}
          </span>
        ))}
      </InView>
    </footer>
  );
}
