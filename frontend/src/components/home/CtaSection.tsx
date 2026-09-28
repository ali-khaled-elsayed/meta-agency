import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Button";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { AnimatedText } from "@/lib/animations/AnimatedText";
import { FadeIn } from "@/lib/animations/FadeIn";
import { MagneticButton } from "@/lib/animations/MagneticButton";
import type { HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref, routes } from "@/lib/routes";
import { isVideoFile } from "@/lib/utils";

type Props = { section: HomeSection; locale: Locale; fallbackLabel: string; videoUrl?: string | null };

export function CtaSection({ section, locale, fallbackLabel, videoUrl }: Props) {
  const href = localizeHref(locale, section.cta?.url ?? routes.contact);
  const label = section.cta?.label ?? fallbackLabel;
  const video = section.video_url ?? videoUrl;

  return (
    <section className="circle-reveal grain relative overflow-hidden bg-lavender text-ink">
      {isVideoFile(video) && (
        <div aria-hidden className="absolute inset-0">
          <LazyVideo src={video!} className="h-full w-full object-cover opacity-60 mix-blend-multiply grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-lavender via-lavender/70 to-lavender/20 rtl:bg-gradient-to-l" />
        </div>
      )}
      <div className="container-site section-y relative z-10 flex flex-col gap-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-5xl">
          {section.eyebrow && (
            <FadeIn>
              <Eyebrow className="text-ink">{section.eyebrow}</Eyebrow>
            </FadeIn>
          )}
          {section.title && <AnimatedText as="h2" text={section.title} className="text-display-xl mt-8" />}
          {section.description && (
            <FadeIn delay={0.2}>
              <p className="mt-8 max-w-xl text-lg text-ink/70">{section.description}</p>
            </FadeIn>
          )}
        </div>
        <FadeIn delay={0.3}>
          <MagneticButton strength={0.45}>
            <Link
              href={href}
              className="group flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-full bg-ink text-center text-sm font-semibold text-paper transition-transform duration-500 hover:scale-105 md:h-52 md:w-52"
            >
              {label}
              <ArrowIcon className="h-5 w-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0 rtl:rotate-45" />
            </Link>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
