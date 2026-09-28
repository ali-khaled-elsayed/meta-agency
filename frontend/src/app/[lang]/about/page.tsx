import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { HighlightsRail } from "@/components/home/HighlightsRail";
import { VelocityMarquee } from "@/components/home/VelocityMarquee";
import { PageCta } from "@/components/sections/PageCta";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { StatsGrid } from "@/components/home/StatsGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/lib/animations/FadeIn";
import { ScrubText } from "@/lib/animations/ScrubText";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getClients, getHighlights, getPage, getSettings, getTeam } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "about", routes.about, dict.nav.about);
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, settings, dict, whyMeta, values, team, clients] = await Promise.all([
    getPage(locale, "about"),
    getSettings(locale),
    getDictionary(locale),
    getHighlights(locale, "why_meta"),
    getHighlights(locale, "values"),
    getTeam(locale),
    getClients(locale),
  ]);
  const highlights = values.length > 0 ? values : whyMeta;

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.about}
        intro={page?.intro}
        image={page?.hero_image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.about, href: localizeHref(locale, routes.about) },
            ]}
          />
        }
      />

      {page?.body && (
        <section className="section-y">
          <div className="container-site grid lg:grid-cols-12">
            <RichText html={page.body} className="lg:col-span-8 lg:col-start-5" />
          </div>
        </section>
      )}

      {(settings.mission || settings.vision) && (
        <section className="border-t border-line">
          {[
            { label: dict.about.mission, text: settings.mission },
            { label: dict.about.vision, text: settings.vision },
          ]
            .filter((b): b is { label: string; text: string } => !!b.text)
            .map((block, i) => (
              <div key={block.label} className="section-y relative overflow-hidden">
                <span
                  aria-hidden
                  className={cn(
                    "drift-y pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-display text-[34vw] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.14)] lg:text-[26vw]",
                    i % 2 === 0 ? "start-[-2vw]" : "end-[-2vw]",
                  )}
                  style={{ "--drift": "8vh" } as CSSProperties}
                >
                  {pad(i + 1)}
                </span>
                <div className="container-site relative grid lg:grid-cols-12">
                  <div className={cn("lg:col-span-7", i % 2 === 0 ? "lg:col-start-6" : "lg:col-start-1")}>
                    <FadeIn>
                      <Eyebrow>{block.label}</Eyebrow>
                    </FadeIn>
                    <ScrubText text={block.text} className="mt-8 font-display text-3xl leading-tight tracking-tight md:text-5xl" />
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}

      {highlights.length > 0 && <VelocityMarquee items={highlights.map((h) => h.title).filter((t): t is string => !!t)} />}

      {settings.statistics.length > 0 && (
        <section className="pb-24 md:pb-40">
          <div className="container-site">
            <StatsGrid stats={settings.statistics} locale={locale} />
          </div>
        </section>
      )}

      {highlights.length > 0 && (
        <section className="bg-ink-2 pb-24 pt-24 md:pt-40 lg:pb-0">
          <div className="container-site mb-16 lg:mb-0">
            <SectionHeading eyebrow={dict.home.whyMeta} />
          </div>
          <HighlightsRail items={highlights} />
        </section>
      )}

      {settings.services.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <SectionHeading eyebrow={dict.about.whatWeDo} title={dict.about.whatWeDoTitle} size="md" className="mb-14 md:mb-20" />
            <ServicesAccordion
              services={settings.services.map((s) => ({ ...s, href: localizeHref(locale, routes.service(s.slug)) }))}
              learnMore={dict.common.learnMore}
            />
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <SectionHeading title={dict.about.team} size="md" className="mb-14" />
            <StaggerContainer className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <StaggerItem key={member.id} as="article">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-3">
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt={member.name ?? ""}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover grayscale transition duration-700 hover:grayscale-0"
                      />
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">{member.name}</h3>
                  {member.position && <p className="text-paper/60">{member.position}</p>}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <ClientMarquee clients={clients} />

      <PageCta locale={locale} dict={dict} title={settings.footer_cta} />
    </>
  );
}
