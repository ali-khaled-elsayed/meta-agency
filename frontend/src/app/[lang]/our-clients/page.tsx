import type { Metadata } from "next";
import Image from "next/image";
import { PageCta } from "@/components/sections/PageCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { StaggerContainer, StaggerItem } from "@/lib/animations/StaggerContainer";
import { getClients, getPage, getSettings } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "our-clients", routes.clients, dict.nav.clients);
}

export default async function ClientsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, clients, settings, dict] = await Promise.all([
    getPage(locale, "our-clients"),
    getClients(locale),
    getSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.clients}
        intro={page?.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.clients, href: localizeHref(locale, routes.clients) },
            ]}
          />
        }
      />
      <section className="pb-24 md:pb-40">
        <div className="container-site">
          {clients.length > 0 ? (
            <StaggerContainer as="ul" stagger={0.04} className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
              {clients.map((client) => {
                const logo = client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name ?? ""}
                    width={240}
                    height={120}
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="h-16 w-auto max-w-[70%] object-contain opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-100 md:h-20"
                  />
                ) : (
                  <span className="font-display text-xl font-semibold">{client.name}</span>
                );
                return (
                  <StaggerItem key={client.id} as="li" className="group flex aspect-[3/2] items-center justify-center bg-ink transition-colors duration-500 hover:bg-ink-3">
                    {client.website_url ? (
                      <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center" aria-label={client.name ?? undefined}>
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          ) : (
            <EmptyState text={dict.clients.empty} />
          )}
        </div>
      </section>
      <PageCta locale={locale} dict={dict} title={settings.footer_cta} />
    </>
  );
}
