import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCta } from "@/components/sections/PageCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Gallery } from "@/components/ui/Gallery";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getService, getServices, getSettings } from "@/lib/api/endpoints";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeStaticParams } from "@/lib/page-meta";
import { resolveParams } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { pad } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  return safeStaticParams(async () => {
    const services = await getServices("en");
    return locales.flatMap((lang) => services.map((s) => ({ lang, slug: s.slug })));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params);
  const [settings, data] = await Promise.all([getSettings(locale), getService(locale, slug)]);
  if (!data) return {};
  const { service } = data;
  return buildMetadata({
    locale,
    path: routes.service(slug),
    settings,
    title: service.title,
    description: service.excerpt,
    image: service.image,
    seo: service.seo,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await resolveParams(params);
  const [data, settings, dict] = await Promise.all([getService(locale, slug), getSettings(locale), getDictionary(locale)]);
  if (!data) notFound();
  const { service, meta } = data;
  const title = service.title ?? service.slug;

  return (
    <>
      <PageHero
        eyebrow={`${pad(meta.index)} / ${pad(meta.total)}`}
        title={title}
        intro={service.excerpt}
        image={service.image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.services, href: localizeHref(locale, routes.services) },
              { name: service.short_title ?? title, href: localizeHref(locale, routes.service(slug)) },
            ]}
          />
        }
      />

      {(service.body || service.capabilities.length > 0) && (
        <section className="section-y">
          <div className="container-site grid gap-16 lg:grid-cols-12">
            {service.capabilities.length > 0 && (
              <aside className="lg:col-span-4">
                <h2 className="text-eyebrow mb-8 text-lavender">{dict.services.capabilities}</h2>
                <StaggerContainer as="ul" className="border-t border-line">
                  {service.capabilities.map((item) => (
                    <StaggerItem key={item} as="li" className="flex items-center gap-4 border-b border-line py-4 text-lg">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lavender" />
                      {item}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </aside>
            )}
            <RichText html={service.body} className={service.capabilities.length > 0 ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-8 lg:col-start-3"} />
          </div>
        </section>
      )}

      {service.process.length > 0 && (
        <section className="section-y bg-ink-2">
          <div className="container-site">
            <SectionHeading eyebrow={dict.services.process} size="md" className="mb-14" />
            <StaggerContainer as="ol" className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <StaggerItem key={step.title} as="li" className="flex flex-col gap-10 bg-ink-2 p-8">
                  <span className="font-display text-5xl font-bold text-lavender">{pad(i + 1)}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                    {step.description && <p className="mt-3 text-paper/60">{step.description}</p>}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {(service.video_url || service.gallery.length > 0) && (
        <section className="section-y">
          <div className="container-site space-y-8">
            <VideoEmbed url={service.video_url} title={title} />
            <Gallery images={service.gallery} alt={title} />
          </div>
        </section>
      )}

      {service.projects.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <SectionHeading eyebrow={dict.services.relatedWork} size="md" className="mb-14" />
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {service.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  href={localizeHref(locale, routes.project(project.slug))}
                  cursorLabel={dict.common.viewProject}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav aria-label={dict.services.allServices} className="border-y border-line">
        <div className="container-site grid md:grid-cols-2">
          {meta.previous && (
            <Link
              href={localizeHref(locale, routes.service(meta.previous.slug))}
              className="group flex flex-col gap-3 border-line py-12 md:border-e md:pe-10"
            >
              <span className="text-eyebrow flex items-center gap-2 text-paper/50">
                <ArrowIcon className="rotate-180 rtl:rotate-0" /> {dict.services.previousService}
              </span>
              <span className="font-display text-2xl font-bold transition-colors group-hover:text-lavender md:text-4xl">{meta.previous.title}</span>
            </Link>
          )}
          {meta.next && (
            <Link
              href={localizeHref(locale, routes.service(meta.next.slug))}
              className="group flex flex-col items-end gap-3 py-12 text-end md:ps-10"
            >
              <span className="text-eyebrow flex items-center gap-2 text-paper/50">
                {dict.services.nextService} <ArrowIcon />
              </span>
              <span className="font-display text-2xl font-bold transition-colors group-hover:text-lavender md:text-4xl">{meta.next.title}</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="container-site flex justify-center py-12">
        <Button href={localizeHref(locale, routes.services)} variant="outline">
          {dict.services.allServices}
        </Button>
      </div>

      <PageCta locale={locale} dict={dict} title={settings.footer_cta} label={dict.services.cta} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          description: service.excerpt ?? undefined,
          image: service.image ?? undefined,
          url: absoluteUrl(localizeHref(locale, routes.service(slug))),
          provider: { "@id": absoluteUrl("/#organization") },
          areaServed: "EG",
        }}
      />
    </>
  );
}
