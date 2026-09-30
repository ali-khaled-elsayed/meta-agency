import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogSection } from "@/components/home/BlogSection";
import { ClientGrid } from "@/components/home/ClientGrid";
import { CtaSection } from "@/components/home/CtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { StatsGrid } from "@/components/home/StatsGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyMetaSection } from "@/components/home/WhyMetaSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomePage, getSettings } from "@/lib/api/endpoints";
import type { HomeSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/params";
import { buildMetadata } from "@/lib/seo";
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const [settings, home] = await Promise.all([getSettings(locale), getHomePage(locale)]);
  return buildMetadata({ locale, path: "/", settings, title: home?.page.title, description: home?.page.intro, seo: home?.page.seo });
}

function renderSection(
  section: HomeSection,
  ctx: { locale: Locale; dict: Dictionary; heroVideo: string | null; introHasStats: boolean },
) {
  const { locale, dict } = ctx;
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} locale={locale} dict={dict} videoUrl={ctx.heroVideo} />;
    case "client_marquee":
      return <ClientGrid clients={section.items} title={section.title} />;
    case "introduction":
      return <IntroSection section={section} locale={locale} />;
    case "services":
      return <ServicesSection section={section} services={section.items} locale={locale} dict={dict} />;
    case "projects":
      return <ProjectsSection section={section} projects={section.items} locale={locale} dict={dict} />;
    case "why_meta":
      return <WhyMetaSection section={section} items={section.items} />;
    case "statistics":
      if (ctx.introHasStats) return null;
      return (
        <section className="section-y">
          <div className="container-site">
            <SectionHeading eyebrow={section.eyebrow} title={section.title} size="md" className="mb-14" />
            <StatsGrid stats={section.items} locale={locale} />
          </div>
        </section>
      );
    case "testimonials":
      return <TestimonialsSection section={section} items={section.items} dict={dict} />;
    case "blog":
      return <BlogSection section={section} posts={section.items} locale={locale} dict={dict} />;
    case "cta":
      return <CtaSection section={section} locale={locale} fallbackLabel={dict.nav.contact} videoUrl={ctx.heroVideo} />;
    default:
      return null;
  }
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [home, settings, dict] = await Promise.all([getHomePage(locale), getSettings(locale), getDictionary(locale)]);
  if (!home) notFound();

  const introHasStats = home.sections.some((s) => s.type === "introduction" && s.statistics.length > 0);
  const ctx = { locale, dict, heroVideo: settings.hero_video_url, introHasStats };
  return (
    <>
      {home.sections.map((section, i) => (
        <div
          key={section.id}
          data-section={section.type}
          id={i > 0 && home.sections[i - 1].type === "hero" ? "main-content" : undefined}
        >
          {renderSection(section, ctx)}
        </div>
      ))}
    </>
  );
}
