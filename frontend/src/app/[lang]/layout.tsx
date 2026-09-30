import type { Metadata, Viewport } from "next";
import { Alexandria, Manrope, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { JsonLd } from "@/components/seo/JsonLd";
import { CustomCursor } from "@/lib/animations/CustomCursor";
import { ScrollProgress } from "@/lib/animations/ScrollProgress";
import { SmoothScroll } from "@/lib/animations/SmoothScroll";
import { getSettings } from "@/lib/api/endpoints";
import { directionOf, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { primaryNav } from "@/lib/navigation";
import { localizeHref, routes } from "@/lib/routes";
import { buildMetadata, organizationJsonLd, SITE_URL } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";
import { cn } from "@/lib/utils";

const heading = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const arabic = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-arabic", display: "swap", preload: false });

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0b0a12",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSettings(lang);
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: settings.site_name ?? undefined,
    ...buildMetadata({ locale: lang, path: "/", settings }),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [settings, dict] = await Promise.all([getSettings(lang), getDictionary(lang)]);
  const siteName = settings.site_name ?? "Meta Egypt Agency";
  const nav = primaryNav(lang, dict, settings);
  const themeToggle = settings.theme_toggle !== false;

  return (
    <html
      lang={lang}
      dir={directionOf(lang)}
      className={cn(heading.variable, body.variable, arabic.variable)}
      suppressHydrationWarning
    >
      <head>{themeToggle && <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />}</head>
      <body className="min-h-dvh overflow-x-clip" suppressHydrationWarning>
        <a
          href="#main"
          className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-full bg-lavender px-5 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
        >
          {dict.nav.skipToContent}
        </a>
        <Preloader />
        <SmoothScroll>
          <ScrollProgress />
          <Header
            locale={lang}
            siteName={siteName}
            logo={settings.logo}
            homeHref={localizeHref(lang, routes.home)}
            themeToggle={themeToggle}
            nav={nav}
            cta={{ label: dict.nav.startProject, href: localizeHref(lang, routes.contact) }}
            email={settings.contact_email}
            phone={settings.contact_phone}
            socials={settings.social_links}
            labels={{
              menu: dict.nav.menu,
              close: dict.nav.close,
              switchLanguage: dict.nav.switchLanguage,
              primary: dict.nav.primary,
              lightMode: dict.nav.lightMode,
              darkMode: dict.nav.darkMode,
            }}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={lang} settings={settings} dict={dict} nav={nav} />
        </SmoothScroll>
        <CustomCursor />
        <JsonLd data={organizationJsonLd(settings, lang)} />
      </body>
    </html>
  );
}
