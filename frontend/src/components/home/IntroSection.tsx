import Link from "next/link";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { AnimatedText } from "@/lib/animations/AnimatedText";
import { FadeIn } from "@/lib/animations/FadeIn";
import { ScrubText } from "@/lib/animations/ScrubText";
import type { HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/routes";
import { StatsGrid } from "./StatsGrid";

const BADGE_PATH = "M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0";

/**
 * Statement block: an outlined backdrop drifts behind a paragraph that lights up word by word, leading into an
 * oversized headline underlined as it scrolls past, beside a badge that rotates with the scroll.
 */
export function IntroSection({ section, locale }: { section: HomeSection; locale: Locale }) {
  const label = section.eyebrow ?? section.title;
  const ctaHref = section.cta ? localizeHref(locale, section.cta.url) : null;

  return (
    <section className="section-y relative overflow-hidden">
      {label && (
        <p
          aria-hidden
          className="drift-x pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap font-display text-[16vw] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.1)]"
        >
          {label} · {label}
        </p>
      )}
      <div className="container-site relative">
        <div className="exit-fade">
          {section.eyebrow && (
            <FadeIn>
              <Eyebrow>{section.eyebrow}</Eyebrow>
            </FadeIn>
          )}
          {section.description && (
            <FadeIn delay={0.1} className="mt-8">
              <ScrubText
                text={section.description}
                className="max-w-xl text-lg leading-relaxed text-paper md:text-2xl md:leading-relaxed"
              />
            </FadeIn>
          )}
        </div>
        {section.title && (
          <div className="exit-fade mt-14 flex items-end justify-between gap-10 md:mt-20">
            <div className="min-w-0">
              <AnimatedText
                as="h2"
                text={section.title}
                className="max-w-[16ch] font-display text-[clamp(3rem,9vw,9.5rem)] font-bold leading-[0.95] tracking-tight"
              />
              <span aria-hidden className="line-scrub mt-8 block h-px max-w-3xl origin-left bg-lavender md:mt-10 rtl:origin-right" />
            </div>
            {label && ctaHref && (
              <Link
                href={ctaHref}
                aria-label={section.cta!.label}
                className="group relative hidden h-44 w-44 shrink-0 items-center justify-center lg:flex xl:h-52 xl:w-52"
              >
                <svg viewBox="0 0 200 200" aria-hidden className="spin-scrub absolute inset-0 h-full w-full">
                  <defs>
                    <path id="intro-badge-path" d={BADGE_PATH} />
                  </defs>
                  <text className="fill-paper/70 font-display text-[15px] uppercase tracking-[0.2em] transition-colors duration-500 group-hover:fill-lavender">
                    <textPath href="#intro-badge-path" textLength={490} lengthAdjust="spacing">
                      {label} • {label} •
                    </textPath>
                  </text>
                </svg>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-125 xl:h-20 xl:w-20">
                  <ArrowIcon className="-rotate-45 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-0" />
                </span>
              </Link>
            )}
          </div>
        )}
        {section.cta && ctaHref && (
          <div className="slide-in mt-14 [--slide-x:-6vw]">
            <Button href={ctaHref} variant="outline">
              {section.cta.label}
            </Button>
          </div>
        )}
      </div>
      {section.statistics.length > 0 && (
        <div className="container-site relative mt-20 md:mt-28">
          <StatsGrid stats={section.statistics} locale={locale} />
        </div>
      )}
    </section>
  );
}
