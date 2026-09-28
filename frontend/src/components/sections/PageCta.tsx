import { CtaSection } from "@/components/home/CtaSection";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";

type Props = { locale: Locale; dict: Dictionary; title: string | null; label?: string; url?: string };

/** Closing call-to-action used at the bottom of inner pages. */
export function PageCta({ locale, dict, title, label, url }: Props) {
  return (
    <CtaSection
      locale={locale}
      fallbackLabel={dict.nav.contact}
      section={{
        id: 0,
        type: "cta",
        eyebrow: dict.footer.letsTalk,
        title,
        description: null,
        image: null,
        video_url: null,
        cta: { label: label ?? dict.nav.startProject, url: url ?? routes.contact },
        secondary_cta: null,
        statistics: [],
        items: [],
      }}
    />
  );
}
