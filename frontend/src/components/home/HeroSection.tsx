import type { CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LogoLockup, LogoMark } from "@/components/ui/LogoMark";
import type { HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/routes";
import { cn, isVideoFile } from "@/lib/utils";
import { HeroBackdrop } from "./HeroBackdrop";
import { ScrollBadge } from "./ScrollBadge";
import { ServiceOrbit } from "./ServiceOrbit";

type Props = { section: HomeSection; locale: Locale; dict: Dictionary; videoUrl?: string | null };

export function HeroSection({ section, locale, dict, videoUrl }: Props) {
  const title = section.title ?? "";
  const words = title.split(/\s+/).filter(Boolean);
  const video = section.video_url ?? videoUrl;
  const wordsDelay = words.length * 70;

  return (
    <section className="hero-intro hero-timeline grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-[var(--header-h)]">
      {!section.image && (
        <div className="hero-media-in absolute inset-0">
          <HeroBackdrop />
        </div>
      )}
      {(section.image || isVideoFile(video)) && (
        <div aria-hidden className="hero-zoom absolute inset-0">
          <div className="hero-media-in absolute inset-0">
            {isVideoFile(video) ? (
              <video
                className="h-full w-full object-cover opacity-80"
                src={video ?? undefined}
                poster={section.image ?? undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image src={section.image!} alt="" fill preload sizes="100vw" className="object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          </div>
        </div>
      )}

      <div aria-hidden className="hero-logo pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div dir="ltr" className="flex flex-col items-center">
          <div className="logo-anim logo-loader relative text-lavender">
            <span className="hero-logo-glow absolute -inset-[35%] rounded-full bg-lavender/25 blur-3xl" />
            <ServiceOrbit />
            <span className="hero-logo-pulse relative block">
              <LogoMark className="h-20 w-auto sm:h-28 md:h-40" />
            </span>
          </div>
          <div className="hero-name grid">
            <div className="min-h-0 overflow-hidden">
              <div className="hero-name-inner flex flex-col items-center pt-6 md:pt-8">
                <LogoLockup size="xl" />
                <span
                  dir="auto"
                  className={cn(
                    "hero-tagline mt-3 block font-sans text-[0.65rem] font-semibold text-lavender sm:text-xs md:mt-4 md:text-sm",
                    locale === "ar" ? "text-xs sm:text-sm md:text-base" : "tracking-[0.2em]",
                  )}
                >
                  {dict.home.tagline360}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-copy hero-lift container-site relative z-10">
        {section.eyebrow && (
          <p className="intro-fade text-eyebrow mb-8 flex items-center gap-3 text-lavender">
            <span aria-hidden className="h-px w-8 bg-current" />
            {section.eyebrow}
          </p>
        )}
        <div className="relative">
          <h1 dir="auto" className="text-display-2xl max-w-[12ch]" aria-label={title}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span className="intro-rise" style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          <div
            className="intro-fade absolute bottom-2 end-0 hidden lg:block"
            style={{ "--d": `${500 + wordsDelay}ms` } as CSSProperties}
          >
            <ScrollBadge label={dict.home.scrollToExplore} />
          </div>
        </div>

        <div
          className="intro-fade relative mt-12 grid gap-10 pt-8 md:grid-cols-12 md:items-end"
          style={{ "--d": `${300 + wordsDelay}ms` } as CSSProperties}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line">
            <span className="intro-line block h-full w-full bg-lavender/60" />
          </span>
          {section.description && (
            <p className="max-w-xl text-lg leading-relaxed text-paper/70 md:col-span-6 md:text-xl">{section.description}</p>
          )}
          <div className="flex flex-wrap gap-4 md:col-span-6 md:justify-end">
            {section.cta && <Button href={localizeHref(locale, section.cta.url)}>{section.cta.label}</Button>}
            {section.secondary_cta && (
              <Button href={localizeHref(locale, section.secondary_cta.url)} variant="outline">
                {section.secondary_cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
