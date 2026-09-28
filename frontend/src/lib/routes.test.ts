import { describe, expect, it } from "vitest";
import { isExternal, localizeHref, routes, switchLocalePath } from "./routes";

describe("localizeHref", () => {
  it("prefixes internal paths", () => {
    expect(localizeHref("en", "/contact")).toBe("/en/contact");
    expect(localizeHref("ar", "about")).toBe("/ar/about");
    expect(localizeHref("ar", "/")).toBe("/ar");
    expect(localizeHref("en", routes.jobApply("designer"))).toBe("/en/job-apply?job=designer");
  });

  it("does not double-prefix localized paths", () => {
    expect(localizeHref("ar", "/en/blog")).toBe("/en/blog");
  });

  it("returns external, mailto, tel and anchor links untouched", () => {
    for (const href of ["https://example.com", "//cdn.example.com/x", "mailto:hi@x.com", "tel:+20100", "#main", ""]) {
      expect(localizeHref("en", href)).toBe(href);
    }
  });
});

describe("switchLocalePath", () => {
  it("swaps the locale segment", () => {
    expect(switchLocalePath("/en/services/branding", "ar")).toBe("/ar/services/branding");
    expect(switchLocalePath("/ar", "en")).toBe("/en");
  });

  it("adds a locale when missing and never leaves a trailing slash", () => {
    expect(switchLocalePath("/", "ar")).toBe("/ar");
    expect(switchLocalePath("/about", "ar")).toBe("/ar/about");
    expect(switchLocalePath("/en/", "ar")).toBe("/ar");
  });
});

describe("isExternal", () => {
  it("detects absolute and protocol-relative URLs", () => {
    expect(isExternal("https://example.com")).toBe(true);
    expect(isExternal("//example.com")).toBe(true);
    expect(isExternal("/en/about")).toBe(false);
  });
});
