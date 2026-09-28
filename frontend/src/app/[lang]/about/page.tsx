import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { StatsGrid } from "@/components/home/StatsGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/lib/animations/FadeIn";
import { ScrubText } from "@/lib/animations/ScrubText";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getClients, getPage, getSettings, getTeam } from "@/lib/api/endpoints";
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
  const [page, settings, dict, team, clients] = await Promise.all([
    getPage(locale, "about"),
    getSettings(locale),
    getDictionary(locale),
    getTeam(locale),
    getClients(locale),
  ]);

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
                {i > 0 && (
                  <span aria-hidden className="line-scrub absolute inset-x-[var(--gutter)] top-0 block h-px origin-left bg-lavender/40 rtl:origin-right" />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "slide-in pointer-events-none absolute inset-y-0 flex items-center",
                    i % 2 === 0 ? "start-[-2vw]" : "end-[-2vw]",
                  )}
                  style={{ "--slide-x": i % 2 === 0 ? "30vw" : "-30vw" } as CSSProperties}
                >
                  <span className="drift-y relative select-none" style={{ "--drift": "8vh" } as CSSProperties}>
                    <span className="spin-scrub absolute left-1/2 top-1/2 block aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-lavender/25" />
                    <span className="mv-fill relative block font-display text-[34vw] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgb(187_169_255/0.2)] lg:text-[26vw]">
                      {pad(i + 1)}
                    </span>
                  </span>
                </span>
                <div className="container-site relative grid lg:grid-cols-12">
                  <div
                    className={cn("slide-in lg:col-span-7", i % 2 === 0 ? "lg:col-start-6" : "lg:col-start-1")}
                    style={{ "--slide-x": i % 2 === 0 ? "-22vw" : "22vw" } as CSSProperties}
                  >
                    <div className="relative ps-6 md:ps-10">
                      <span aria-hidden className="absolute inset-y-0 start-0 w-px bg-line">
                        <span className="mv-progress block h-full w-full origin-top bg-lavender" />
                      </span>
                      <FadeIn>
                        <Eyebrow>{block.label}</Eyebrow>
                      </FadeIn>
                      <ScrubText text={block.text} className="mt-8 font-display text-3xl leading-tight tracking-tight md:text-5xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}

      {settings.statistics.length > 0 && (
        <section className="pb-24 md:pb-40">
          <div className="container-site">
            <StatsGrid stats={settings.statistics} locale={locale} />
          </div>
        </section>
      )}

      {settings.services.length > 0 && (
        <section className="section-y overflow-x-clip">
          <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="slide-in lg:sticky lg:top-32" style={{ "--slide-x": "-8vw" } as CSSProperties}>
                <SectionHeading eyebrow={dict.about.whatWeDo} title={dict.about.whatWeDoTitle} size="md" />
              </div>
            </div>
            <div className="lg:col-span-8">
              <ServicesAccordion
                variant="list"
                services={settings.services.map((s) => ({ ...s, href: localizeHref(locale, routes.service(s.slug)) }))}
                learnMore={dict.common.learnMore}
              />
            </div>
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
    </>
  );
}
