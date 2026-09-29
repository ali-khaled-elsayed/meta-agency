import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Gallery } from "@/components/ui/Gallery";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { getProject, getProjects, getSettings } from "@/lib/api/endpoints";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeStaticParams } from "@/lib/page-meta";
import { resolveParams } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const projects = await getProjects("en");
    return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params);
  const [settings, data] = await Promise.all([getSettings(locale), getProject(locale, slug)]);
  if (!data) return {};
  const { project } = data;
  return buildMetadata({
    locale,
    path: routes.project(slug),
    settings,
    title: project.title,
    description: project.excerpt,
    image: project.image,
    seo: project.seo,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await resolveParams(params);
  const [data, dict] = await Promise.all([getProject(locale, slug), getDictionary(locale)]);
  if (!data) notFound();
  const { project, related } = data;
  const title = project.title ?? project.slug;

  const facts = [
    project.client?.name && { label: dict.projects.client, value: project.client.name },
    project.service && {
      label: dict.projects.service,
      value: (
        <Link href={localizeHref(locale, routes.service(project.service.slug))} className="hover:text-lavender">
          {project.service.title}
        </Link>
      ),
    },
    project.year && { label: dict.projects.year, value: project.year },
  ].filter(Boolean) as { label: string; value: ReactNode }[];

  return (
    <>
      <PageHero
        eyebrow={project.service?.title}
        title={title}
        intro={project.excerpt}
        image={project.image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.work, href: localizeHref(locale, routes.projects) },
              { name: title, href: localizeHref(locale, routes.project(slug)) },
            ]}
          />
        }
      >
        {facts.length > 0 && (
          <dl className="intro-fade mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3" style={{ "--d": "600ms" } as CSSProperties}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-eyebrow text-paper/60">{fact.label}</dt>
                <dd className="mt-3 text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHero>

      {project.client?.logo && (
        <div className="container-site">
          <Image src={project.client.logo} alt={project.client.name ?? ""} width={160} height={80} className="h-14 w-auto object-contain opacity-70" />
        </div>
      )}

      {project.body && (
        <section className="section-y">
          <div className="container-site grid lg:grid-cols-12">
            <RichText html={project.body} className="lg:col-span-8 lg:col-start-3" />
          </div>
        </section>
      )}

      {(project.video_url || project.gallery.length > 0) && (
        <section className="pb-24 md:pb-40">
          <div className="container-site space-y-8">
            <VideoEmbed url={project.video_url} title={title} />
            <Gallery images={project.gallery} alt={title} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading eyebrow={dict.projects.moreWork} size="md" className="mb-14" />
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  href={localizeHref(locale, routes.project(p.slug))}
                  cursorLabel={dict.common.viewProject}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: title,
          description: project.excerpt ?? undefined,
          image: project.image ?? undefined,
          url: absoluteUrl(localizeHref(locale, routes.project(slug))),
          dateCreated: project.year ? String(project.year) : undefined,
          creator: { "@id": absoluteUrl("/#organization") },
        }}
      />
    </>
  );
}
