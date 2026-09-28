import type { CSSProperties } from "react";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/lib/animations/FadeIn";
import type { HomeSection, Service } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref, routes } from "@/lib/routes";

type Props = { section: HomeSection; services: Service[]; locale: Locale; dict: Dictionary };

export function ServicesSection({ section, services, locale, dict }: Props) {
  return (
    <section className="section-y overflow-x-clip">
      <div className="container-site grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="slide-in lg:sticky lg:top-[calc(var(--header-h)+2rem)]" style={{ "--slide-x": "-8vw" } as CSSProperties}>
            <FadeIn>
              <Eyebrow>{section.eyebrow ?? section.title}</Eyebrow>
            </FadeIn>
            {section.eyebrow && section.title && (
              <FadeIn delay={0.1}>
                <p className="mt-5 max-w-xs text-paper/50">{section.title}</p>
              </FadeIn>
            )}
            {section.cta && (
              <FadeIn delay={0.2} className="mt-8">
                <Button href={localizeHref(locale, section.cta.url)} variant="outline">
                  {section.cta.label}
                </Button>
              </FadeIn>
            )}
          </div>
        </div>
        <div className="lg:col-span-9">
          <ServicesAccordion
            variant="list"
            services={services.map((s) => ({ ...s, href: localizeHref(locale, routes.service(s.slug)) }))}
            learnMore={dict.common.discover}
          />
        </div>
      </div>
    </section>
  );
}
