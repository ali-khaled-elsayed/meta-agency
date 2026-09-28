import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getJob, getJobs, getSettings } from "@/lib/api/endpoints";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeStaticParams } from "@/lib/page-meta";
import { resolveParams } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

const EMPLOYMENT_SCHEMA: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  freelance: "CONTRACTOR",
  temporary: "TEMPORARY",
};

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const jobs = await getJobs("en");
    return locales.flatMap((lang) => jobs.map((j) => ({ lang, slug: j.slug })));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params);
  const [settings, job] = await Promise.all([getSettings(locale), getJob(locale, slug)]);
  if (!job) return {};
  return buildMetadata({ locale, path: routes.job(slug), settings, title: job.title, description: job.summary, seo: job.seo });
}

export default async function JobPage({ params }: Props) {
  const { locale, slug } = await resolveParams(params);
  const [job, settings, dict] = await Promise.all([getJob(locale, slug), getSettings(locale), getDictionary(locale)]);
  if (!job) notFound();
  const title = job.title ?? job.slug;
  const applyHref = localizeHref(locale, routes.jobApply(slug));

  const facts = [
    { label: dict.career.department, value: job.department },
    { label: dict.career.location, value: job.location },
    { label: dict.career.type, value: job.employment_type_label },
    { label: dict.career.workplace, value: job.workplace_type_label },
    { label: dict.career.closes, value: job.closes_at ? formatDate(job.closes_at, locale) : null },
  ].filter((f) => f.value);

  const lists = [
    { title: dict.career.responsibilities, items: job.responsibilities },
    { title: dict.career.requirements, items: job.requirements },
    { title: dict.career.benefits, items: job.benefits },
  ].filter((l) => l.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.career}
        title={title}
        intro={job.summary}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.career, href: localizeHref(locale, routes.career) },
              { name: title, href: localizeHref(locale, routes.job(slug)) },
            ]}
          />
        }
      >
        <div className="intro-fade mt-12">
          <Button href={applyHref}>{dict.career.applyFor}</Button>
        </div>
      </PageHero>

      <section className="section-y border-t border-line">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="sticky top-28 space-y-6 rounded-2xl border border-line bg-ink-2 p-8">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-eyebrow text-paper/60">{fact.label}</dt>
                  <dd className="mt-2 text-lg">{fact.value}</dd>
                </div>
              ))}
              <div className="pt-2">
                <Button href={applyHref} magnetic={false} className="w-full justify-center">
                  {dict.common.apply}
                </Button>
              </div>
            </dl>
          </aside>
          <div className="space-y-16 lg:col-span-7 lg:col-start-6">
            {lists.map((list) => (
              <div key={list.title}>
                <h2 className="text-display-md mb-8">{list.title}</h2>
                <StaggerContainer as="ul" className="space-y-4">
                  {list.items.map((item) => (
                    <StaggerItem key={item} as="li" className="flex gap-4 text-lg text-paper/80">
                      <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" />
                      {item}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title,
          description: [job.summary, ...job.responsibilities, ...job.requirements].filter(Boolean).join("\n") || title,
          datePosted: job.published_at ?? undefined,
          validThrough: job.closes_at ?? undefined,
          employmentType: EMPLOYMENT_SCHEMA[job.employment_type] ?? undefined,
          jobLocationType: job.workplace_type === "remote" ? "TELECOMMUTE" : undefined,
          hiringOrganization: { "@type": "Organization", name: settings.site_name, sameAs: absoluteUrl(`/${locale}`), logo: settings.logo ?? undefined },
          jobLocation: job.location
            ? { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "EG" } }
            : undefined,
          url: absoluteUrl(localizeHref(locale, routes.job(slug))),
        }}
      />
    </>
  );
}
