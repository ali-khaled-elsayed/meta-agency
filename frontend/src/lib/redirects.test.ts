import { describe, expect, it } from "vitest";
import type { RedirectRule } from "@/lib/api/types";
import { preferredLocale, resolveRedirect } from "./redirects";

const rules = [
  { from_path: "/services", to_path: "/our-services", status_code: 301 },
  { from_path: "/our-team/", to_path: "/about", status_code: 301 },
  { from_path: "/old-home", to_path: "/", status_code: 302 },
  { from_path: "/brochure", to_path: "https://example.com/brochure.pdf", status_code: 301 },
] as RedirectRule[];

describe("preferredLocale", () => {
  it("falls back to English", () => {
    expect(preferredLocale(null)).toBe("en");
    expect(preferredLocale("fr-FR,fr;q=0.9")).toBe("en");
  });

  it("picks Arabic from the first language", () => {
    expect(preferredLocale("ar-EG,ar;q=0.9,en;q=0.8")).toBe("ar");
  });
});

describe("resolveRedirect", () => {
  it("sends the root to the preferred locale with a temporary redirect", () => {
    expect(resolveRedirect("/", [], "ar")).toEqual({ location: "/ar", status: 307 });
    expect(resolveRedirect("/", [], null)).toEqual({ location: "/en", status: 307 });
  });

  it("leaves localized paths without a rule alone", () => {
    expect(resolveRedirect("/en/about", rules, null)).toBeNull();
    expect(resolveRedirect("/ar", rules, null)).toBeNull();
  });

  it("applies CMS rules without a locale prefix under the default locale", () => {
    expect(resolveRedirect("/services", rules, "ar")).toEqual({ location: "/en/our-services", status: 301 });
  });

  it("applies CMS rules inside a locale, keeping that locale", () => {
    expect(resolveRedirect("/ar/services", rules, null)).toEqual({ location: "/ar/our-services", status: 301 });
  });

  it("matches rules case- and trailing-slash-insensitively", () => {
    expect(resolveRedirect("/Our-Team", rules, null)).toEqual({ location: "/en/about", status: 301 });
    expect(resolveRedirect("/services/", rules, null)).toEqual({ location: "/en/our-services", status: 301 });
  });

  it("maps a rule targeting the root to the bare locale", () => {
    expect(resolveRedirect("/old-home", rules, null)).toEqual({ location: "/en", status: 302 });
  });

  it("passes absolute targets through untouched", () => {
    expect(resolveRedirect("/brochure", rules, null)).toEqual({ location: "https://example.com/brochure.pdf", status: 301 });
  });

  it("permanently moves other legacy paths under the default locale", () => {
    expect(resolveRedirect("/contact", rules, "ar")).toEqual({ location: "/en/contact", status: 301 });
  });
});
