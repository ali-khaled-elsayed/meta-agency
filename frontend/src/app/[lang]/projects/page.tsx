import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { getPage, getProjects, getSettings } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { isVideoFile } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "projects", routes.projects, dict.nav.work);
}

export default async function ProjectsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, projects, settings, dict] = await Promise.all([
    getPage(locale, "projects"),
    getProjects(locale),
    getSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.work}
        intro={page?.intro}
        video={[page?.hero_video_url, settings.hero_video_url].find(isVideoFile)}
        videoAsBackground
        image={projects.find((p) => p.image)?.image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.work, href: localizeHref(locale, routes.projects) },
            ]}
          />
        }
      />
      <section className="pb-24 md:pb-40">
        <div className="container-site">
          {projects.length > 0 ? (
            <ProjectsGrid
              projects={projects.map((p) => ({ ...p, href: localizeHref(locale, routes.project(p.slug)) }))}
              allLabel={dict.common.all}
              cursorLabel={dict.common.viewProject}
            />
          ) : (
            <EmptyState text={dict.projects.empty}>
              <Button href={localizeHref(locale, routes.services)}>{dict.nav.services}</Button>
              <Button href={localizeHref(locale, routes.contact)} variant="outline">
                {dict.nav.contact}
              </Button>
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
