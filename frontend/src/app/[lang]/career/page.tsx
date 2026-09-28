import type { Metadata } from "next";
import Image from "next/image";
import { JobRow } from "@/components/cards/JobRow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getHighlights, getJobs, getPage } from "@/lib/api/endpoints";
import type { Highlight } from "@/lib/api/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { pad } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "career", routes.career, dict.nav.career);
}

function HighlightGrid({ items, title }: { items: Highlight[]; title: string }) {
  if (items.length === 0) return null;
  return (
    <section className="section-y border-t border-line">
      <div className="container-site">
        <SectionHeading title={title} size="md" className="mb-14" />
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <StaggerItem key={item.id} as="article" className="rounded-2xl border border-line bg-ink-2 p-8">
              {item.image ? (
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
              ) : (
                <span className="mb-8 block font-display text-4xl font-bold text-lavender">{pad(i + 1)}</span>
              )}
              <h3 className="font-display text-2xl font-bold">{item.title}</h3>
              {item.description && <p className="mt-3 text-paper/60">{item.description}</p>}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default async function CareerPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, jobs, benefits, culture, dict] = await Promise.all([
    getPage(locale, "career"),
    getJobs(locale),
    getHighlights(locale, "career_benefits"),
    getHighlights(locale, "career_culture"),
    getDictionary(locale),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.career}
        intro={page?.intro}
        image={page?.hero_image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.career, href: localizeHref(locale, routes.career) },
            ]}
          />
        }
      />

      {page?.body && (
        <section className="pb-24">
          <div className="container-site grid lg:grid-cols-12">
            <RichText html={page.body} className="lg:col-span-8 lg:col-start-5" />
          </div>
        </section>
      )}

      <section id="positions" className="section-y border-t border-line">
        <div className="container-site">
          <SectionHeading eyebrow={dict.career.openPositions} size="md" className="mb-10" />
          {jobs.length > 0 ? (
            <div className="border-t border-line">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} href={localizeHref(locale, routes.job(job.slug))} />
              ))}
            </div>
          ) : (
            <EmptyState text={dict.career.noOpenings}>
              <Button href={localizeHref(locale, routes.jobApply())}>{dict.career.generalApplication}</Button>
            </EmptyState>
          )}
          {jobs.length > 0 && (
            <div className="mt-12">
              <Button href={localizeHref(locale, routes.jobApply())} variant="outline">
                {dict.career.generalApplication}
              </Button>
            </div>
          )}
        </div>
      </section>

      <HighlightGrid items={benefits} title={dict.career.benefitsTitle} />
      <HighlightGrid items={culture} title={dict.career.cultureTitle} />
    </>
  );
}
