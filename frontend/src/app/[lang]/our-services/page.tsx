import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageCta } from "@/components/sections/PageCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowIcon } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/lib/animations/FadeIn";
import { RevealImage } from "@/lib/animations/RevealImage";
import { getPage, getServices, getSettings } from "@/lib/api/endpoints";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPageMetadata } from "@/lib/page-meta";
import { resolveLocale } from "@/lib/params";
import { localizeHref, routes } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return cmsPageMetadata(locale, "our-services", routes.services, dict.nav.services);
}

export default async function ServicesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, services, settings, dict] = await Promise.all([
    getPage(locale, "our-services"),
    getServices(locale),
    getSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title ?? dict.nav.services}
        intro={page?.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: dict.nav.home, href: localizeHref(locale, routes.home) },
              { name: dict.nav.services, href: localizeHref(locale, routes.services) },
            ]}
          />
        }
      />

      <section className="pb-24 md:pb-40">
        <ol className="container-site">
          {services.map((service, i) => (
            <li key={service.id} className="border-t border-line last:border-b">
              <Link
                href={localizeHref(locale, routes.service(service.slug))}
                data-cursor={dict.common.discover}
                className="group grid items-center gap-8 py-12 md:grid-cols-12 md:py-16"
              >
                <span className="font-display text-sm text-lavender md:col-span-1">{pad(i + 1)}</span>
                <div className="md:col-span-6">
                  <h2 className="font-display text-3xl font-bold tracking-tight transition-colors duration-500 group-hover:text-lavender md:text-5xl">
                    {service.title}
                  </h2>
                  {service.excerpt && (
                    <FadeIn>
                      <p className="mt-5 max-w-xl line-clamp-3 text-paper/60">{service.excerpt}</p>
                    </FadeIn>
                  )}
                </div>
                <div className={cn("md:col-span-4", i % 2 === 1 && "md:order-first md:col-span-4 md:col-start-2")}>
                  {service.image && (
                    <RevealImage className="aspect-[4/3] rounded-2xl" direction="side">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105"
                      />
                    </RevealImage>
                  )}
                </div>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-lavender group-hover:bg-lavender group-hover:text-ink">
                    <ArrowIcon className="-rotate-45 rtl:rotate-45" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <PageCta locale={locale} dict={dict} title={settings.footer_cta} />
    </>
  );
}
