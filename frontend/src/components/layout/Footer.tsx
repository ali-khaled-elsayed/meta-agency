import type { CSSProperties } from "react";
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
import { telHref, whatsappHref } from "@/lib/utils";
import { BackToTop } from "./BackToTop";
import type { NavItem } from "./types";

type Props = { locale: Locale; settings: SiteSettings; dict: Dictionary; nav: NavItem[] };

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

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={href(routes.home)} aria-label={siteName} className="inline-block">
              <InView as="span" className="logo-onview block">
                <LogoLockup name={siteName} size="lg" />
              </InView>
            </Link>
            {settings.tagline && <p className="mt-6 max-w-sm leading-relaxed text-paper/60">{settings.tagline}</p>}
            {settings.social_links.length > 0 && (
              <ul className="mt-8 flex gap-3" aria-label={dict.common.followUs}>
                {settings.social_links.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-lavender hover:bg-lavender hover:text-ink"
                    >
                      <SocialIcon platform={s.platform} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label={dict.footer.explore} className="lg:col-span-2">
            <h2 className="text-eyebrow mb-6 text-paper/60">{dict.footer.explore}</h2>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/80 transition-colors hover:text-lavender">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {settings.services.length > 0 && (
            <nav aria-label={dict.footer.services} className="lg:col-span-3">
              <h2 className="text-eyebrow mb-6 text-paper/60">{dict.footer.services}</h2>
              <ul className="space-y-3">
                {settings.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={href(routes.service(s.slug))} className="text-paper/80 transition-colors hover:text-lavender">
                      {s.short_title ?? s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="lg:col-span-3">
            <h2 className="text-eyebrow mb-6 text-paper/60">{dict.footer.contact}</h2>
            <address className="space-y-6 not-italic text-paper/80">
              {settings.offices.map((office) => (
                <div key={office.id}>
                  {office.name && <p className="font-semibold text-paper">{office.name}</p>}
                  {office.address && <p className="text-paper/60">{office.address}</p>}
                </div>
              ))}
              <div className="space-y-2">
                {settings.contact_phone && (
                  <p>
                    <a href={telHref(settings.contact_phone)} dir="ltr" className="transition-colors hover:text-lavender">
                      {settings.contact_phone}
                    </a>
                  </p>
                )}
                {settings.whatsapp_number && (
                  <p>
                    <a
                      href={whatsappHref(settings.whatsapp_number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-lavender"
                    >
                      {dict.common.whatsapp}
                    </a>
                  </p>
                )}
                {settings.working_hours && <p className="text-sm text-paper/50">{settings.working_hours}</p>}
              </div>
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
