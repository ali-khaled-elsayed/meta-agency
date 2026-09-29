import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { VelocityMarquee } from "@/components/home/VelocityMarquee";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowIcon } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { FadeIn } from "@/lib/animations/FadeIn";
import { TiltCard } from "@/lib/animations/TiltCard";
import { getPage, getSettings } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { pad, telHref, whatsappHref } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "contact", routes.contact, dict.nav.contact);
}

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, settings, dict] = await Promise.all([getPage(locale, "contact"), getSettings(locale), getDictionary(locale)]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.contact}
        intro={page?.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.contact, href: localizeHref(locale, routes.contact) },
            ]}
          />
        }
      />

      <section className="pb-24 md:pb-40">
        <div className="container-site grid gap-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm
              locale={locale}
              labels={dict.form}
              serviceOptions={settings.contact_service_options ?? []}
              budgetOptions={settings.budget_options ?? []}
            />
          </div>

          <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
            <FadeIn className="space-y-4">
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="block font-display text-2xl font-semibold transition-colors hover:text-lavender md:text-3xl">
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && (
                <a href={telHref(settings.contact_phone)} dir="ltr" className="block font-display text-2xl font-semibold transition-colors hover:text-lavender md:text-3xl rtl:text-end">
                  {settings.contact_phone}
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={whatsappHref(settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-line px-5 py-3 text-sm font-semibold transition-colors hover:border-lavender hover:text-lavender"
                >
                  <SocialIcon platform="whatsapp" className="h-4 w-4" />
                  {dict.common.whatsapp}
                </a>
              )}
            </FadeIn>

            {settings.working_hours && (
              <FadeIn delay={0.15}>
                <h2 className="text-eyebrow mb-3 text-lavender">{dict.common.workingHours}</h2>
                <p className="text-paper/70">{settings.working_hours}</p>
              </FadeIn>
            )}

            {settings.social_links.length > 0 && (
              <FadeIn delay={0.2}>
                <h2 className="text-eyebrow mb-4 text-lavender">{dict.common.followUs}</h2>
                <ul className="flex gap-3">
                  {settings.social_links.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors hover:border-lavender hover:bg-lavender hover:text-ink"
                      >
                        <SocialIcon platform={s.platform} className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
          </aside>
        </div>
      </section>

      {settings.contact_email && (
        <a href={`mailto:${settings.contact_email}`} className="block transition-colors hover:text-lavender" aria-label={settings.contact_email}>
          <VelocityMarquee items={[settings.contact_email]} />
        </a>
      )}

      {settings.offices.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <SectionHeading title={dict.common.offices} size="md" className="mb-14 md:mb-20" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {settings.offices.map((office, i) => (
                <FadeIn key={office.id} delay={i * 0.1} y={60} className="h-full">
                  <TiltCard className="h-full rounded-3xl">
                    <address className="group relative flex h-full flex-col md:min-h-72 overflow-hidden rounded-3xl border border-line p-8 not-italic transition-colors duration-500 hover:border-lavender hover:text-ink md:p-10">
                      <span
                        aria-hidden
                        className="absolute inset-0 origin-bottom scale-y-0 bg-lavender transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
                      />
                      <span className="relative font-display text-sm text-lavender transition-colors group-hover:text-ink">{pad(i + 1)}</span>
                      {office.name && <p className="relative mt-6 font-display text-3xl font-bold tracking-tight">{office.name}</p>}
                      {office.address && <p className="relative mt-3 text-paper/60 transition-colors group-hover:text-ink/70">{office.address}</p>}
                      {office.hours && <p className="relative mt-2 text-sm text-paper/60 transition-colors group-hover:text-ink/70">{office.hours}</p>}
                      {office.map_url && (
                        <a
                          href={office.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative mt-auto inline-flex items-center gap-3 pt-8 text-sm font-semibold"
                        >
                          {dict.common.getDirections}
                          <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 rtl:rotate-[-135deg] rtl:group-hover:rotate-180" />
                        </a>
                      )}
                    </address>
                  </TiltCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
