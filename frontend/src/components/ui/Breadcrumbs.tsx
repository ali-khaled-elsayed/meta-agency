import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-eyebrow text-paper/50">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-paper/80">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-lavender">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items.map((i) => ({ name: i.name, path: i.href })))} />
    </>
  );
}
