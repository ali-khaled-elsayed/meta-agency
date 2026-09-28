import type { Metadata } from "next";
import { ClientsHoneycomb } from "@/components/sections/ClientsHoneycomb";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { getClients, getPage } from "@/lib/api/endpoints";
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
  const [page, clients, dict] = await Promise.all([
    getPage(locale, "our-clients"),
    getClients(locale),
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
            <ClientsHoneycomb clients={clients} />
          ) : (
            <EmptyState text={dict.clients.empty} />
          )}
        </div>
      </section>
    </>
  );
}
