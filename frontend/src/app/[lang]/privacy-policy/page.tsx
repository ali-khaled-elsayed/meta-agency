import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { getPage } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "privacy-policy", routes.privacy, dict.footer.privacy);
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, dict] = await Promise.all([getPage(locale, "privacy-policy"), getDictionary(locale)]);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title ?? dict.footer.privacy}
        intro={page.updated_at ? formatDate(page.updated_at, locale) : null}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: page.title ?? dict.footer.privacy, href: localizeHref(locale, routes.privacy) },
            ]}
          />
        }
      />
      <section className="pb-24 md:pb-40">
        <div className="container-site">
          <RichText html={page.body} className="mx-auto max-w-3xl" />
        </div>
      </section>
    </>
  );
}
