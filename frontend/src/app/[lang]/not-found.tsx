import { lang } from "next/root-params";
import { Button } from "@/components/ui/Button";
import { StatusScreen } from "@/components/ui/StatusScreen";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeHref } from "@/lib/routes";

export default async function NotFound() {
  const value = await lang();
  const locale = isLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <StatusScreen code="404" title={dict.errors.notFoundTitle} text={dict.errors.notFoundText}>
      <Button href={localizeHref(locale, "/")}>{dict.errors.backHome}</Button>
      <Button href={localizeHref(locale, "/contact")} variant="outline">
        {dict.nav.contact}
      </Button>
    </StatusScreen>
  );
}
