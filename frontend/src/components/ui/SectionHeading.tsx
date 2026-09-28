import type { ReactNode } from "react";
import { AnimatedText } from "@/lib/animations/AnimatedText";
import { FadeIn } from "@/lib/animations/FadeIn";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  className?: string;
  size?: "lg" | "md";
  as?: "h1" | "h2" | "h3";
  action?: ReactNode;
};

export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("text-eyebrow flex items-center gap-3 text-lavender", className)}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </Tag>
  );
}

export function SectionHeading({ eyebrow, title, description, className, size = "lg", as = "h2", action }: Props) {
  if (!eyebrow && !title && !description) return null;
  return (
    <div className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-4xl">
        {eyebrow && (
          <FadeIn>
            <Eyebrow className="mb-6" as={title || as === "h1" ? "p" : as}>
              {eyebrow}
            </Eyebrow>
          </FadeIn>
        )}
        {title && (
          <AnimatedText as={as} text={title} className={size === "lg" ? "text-display-lg" : "text-display-md"} />
        )}
        {description && (
          <FadeIn delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-current/70">{description}</p>
          </FadeIn>
        )}
      </div>
      {action && <FadeIn delay={0.2}>{action}</FadeIn>}
    </div>
  );
}
