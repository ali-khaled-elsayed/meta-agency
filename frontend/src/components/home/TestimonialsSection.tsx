import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeSection, Testimonial } from "@/lib/api/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { TestimonialsSlider } from "./TestimonialsSlider";

type Props = { section: HomeSection; items: Testimonial[]; dict: Dictionary };

export function TestimonialsSection({ section, items, dict }: Props) {
  return (
    <section className="section-y bg-ink-2">
      <div className="container-site">
        <SectionHeading eyebrow={section.eyebrow ?? dict.home.clientStories} title={section.title} size="md" className="mb-16" />
        <TestimonialsSlider items={items} labels={{ previous: dict.common.previous, next: dict.common.next }} />
      </div>
    </section>
  );
}
