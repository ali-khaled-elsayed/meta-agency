import type { Metadata } from "next";
import { JobApplicationForm } from "@/components/forms/JobApplicationForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { getJobs, getPage, getSettings } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ job?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "job-apply", routes.jobApply(), dict.career.generalApplication);
}

export default async function JobApplyPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const { job } = await searchParams;
  const [page, jobs, settings, dict] = await Promise.all([
    getPage(locale, "job-apply"),
    getJobs(locale),
    getSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.career.generalApplication}
        intro={page?.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.career, href: localizeHref(locale, routes.career) },
              { name: page?.title ?? dict.career.generalApplication, href: localizeHref(locale, routes.jobApply()) },
            ]}
          />
        }
      />
      <section className="pb-24 md:pb-40">
        <div className="container-site grid lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <JobApplicationForm
              locale={locale}
              labels={dict.form}
              jobs={jobs}
              selectedJob={job?.slice(0, 150)}
              fields={settings.job_form_fields}
              englishLevels={settings.english_levels ?? []}
              sourceOptions={settings.job_source_options ?? []}
              privacyHref={localizeHref(locale, routes.privacy)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
