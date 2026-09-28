import { Eyebrow } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/lib/animations/FadeIn";
import type { HomeSection, Project } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizeHref, routes } from "@/lib/routes";
import { WorkTiles } from "./WorkTiles";

type Props = { section: HomeSection; projects: Project[]; locale: Locale; dict: Dictionary };

export function ProjectsSection({ section, projects, locale, dict }: Props) {
  if (projects.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-site mb-12 md:mb-16">
        <FadeIn>
          <Eyebrow>{section.title ?? dict.home.latestWork}</Eyebrow>
        </FadeIn>
      </div>
      <WorkTiles
        items={projects.map((project) => ({ project, href: localizeHref(locale, routes.project(project.slug)) }))}
        cursorLabel={dict.common.viewProject}
        loadMoreLabel={dict.common.loadMore}
        viewAll={{ label: section.cta?.label ?? dict.common.viewAll, href: localizeHref(locale, section.cta?.url ?? routes.projects) }}
      />
    </section>
  );
}
