import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Highlight, HomeSection } from "@/lib/api/types";
import { HighlightsRail } from "./HighlightsRail";

export function WhyMetaSection({ section, items }: { section: HomeSection; items: Highlight[] }) {
  return (
    <section className="pt-24 md:pt-40 lg:pb-0 pb-24">
      <div className="container-site mb-16 lg:mb-0">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />
      </div>
      <HighlightsRail items={items} backdrop={section.eyebrow ?? section.title} />
    </section>
  );
}
