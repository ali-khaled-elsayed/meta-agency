import { cn } from "@/lib/utils";

/** Body HTML is sanitized by the API (Symfony HtmlSanitizer) before it reaches the frontend. */
export function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return <div className={cn("prose-meta", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
