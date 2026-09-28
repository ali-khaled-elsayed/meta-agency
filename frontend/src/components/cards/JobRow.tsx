import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Button";
import type { JobPosting } from "@/lib/api/types";

export function JobRow({ job, href }: { job: JobPosting; href: string }) {
  return (
    <Link href={href} className="group grid gap-4 border-b border-line py-8 md:grid-cols-12 md:items-center">
      <div className="md:col-span-6">
        <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-lavender md:text-3xl">{job.title}</h3>
        {job.summary && <p className="mt-2 line-clamp-2 text-paper/60">{job.summary}</p>}
      </div>
      <p className="text-paper/60 md:col-span-2">{job.department}</p>
      <p className="text-paper/60 md:col-span-2">{job.location}</p>
      <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
        <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-paper/70">
          {job.employment_type_label}
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-lavender group-hover:bg-lavender group-hover:text-ink">
          <ArrowIcon className="-rotate-45 rtl:rotate-45" />
        </span>
      </div>
    </Link>
  );
}
