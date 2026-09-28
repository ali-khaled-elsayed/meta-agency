import { describe, expect, it } from "vitest";
import type { SiteSettings } from "@/lib/api/types";
import { SITE_URL, breadcrumbJsonLd, buildMetadata, organizationJsonLd } from "./seo";

const settings = {
  site_name: "Meta Egypt Agency",
  description: "360 marketing agency.",
  logo: "https://cdn.test/logo.png",
  default_og_image: null,
  contact_email: "info@test.com",
  contact_phone: "+20 100",
  offices: [{ name: "Cairo", address: "Nasr City", is_primary: true }],
  social_links: [{ platform: "facebook", url: "https://facebook.com/meta" }],
} as unknown as SiteSettings;

describe("buildMetadata", () => {
  it("builds canonical and hreflang alternates for every locale", () => {
    const meta = buildMetadata({ locale: "ar", path: "/about", settings, title: "About" });
    expect(meta.alternates?.canonical).toBe("/ar/about");
    expect(meta.alternates?.languages).toEqual({ en: "/en/about", ar: "/ar/about", "x-default": "/en/about" });
  });

  it("maps the home path to the bare locale", () => {
    const meta = buildMetadata({ locale: "en", path: "/", settings });
    expect(meta.alternates?.canonical).toBe("/en");
    expect(meta.title).toBe("Meta Egypt Agency");
  });

  it("prefers CMS SEO fields over page fields and appends the site name", () => {
    const meta = buildMetadata({
      locale: "en",
      path: "/blog/x",
      settings,
      title: "Page title",
      description: "Page description",
      seo: { title: "SEO title", description: "SEO description", image: "https://cdn.test/og.jpg", noindex: true },
    });
    expect(meta.title).toEqual({ absolute: "SEO title — Meta Egypt Agency" });
    expect(meta.description).toBe("SEO description");
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: ["https://cdn.test/og.jpg"] });
  });

  it("falls back to the site description and logo", () => {
    const meta = buildMetadata({ locale: "en", path: "/contact", settings });
    expect(meta.description).toBe("360 marketing agency.");
    expect(meta.openGraph?.images).toEqual([{ url: "https://cdn.test/logo.png" }]);
  });
});

describe("JSON-LD", () => {
  it("describes the organization from settings", () => {
    const org = organizationJsonLd(settings, "en");
    expect(org).toMatchObject({
      "@type": "MarketingAgency",
      "@id": `${SITE_URL}/#organization`,
      url: `${SITE_URL}/en`,
      sameAs: ["https://facebook.com/meta"],
      address: { streetAddress: "Nasr City", addressCountry: "EG" },
    });
  });

  it("numbers breadcrumb items with absolute URLs", () => {
    const crumbs = breadcrumbJsonLd([
      { name: "Home", path: "/en" },
      { name: "Blog", path: "/en/blog" },
    ]);
    expect(crumbs.itemListElement[1]).toEqual({ "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/en/blog` });
  });
});
