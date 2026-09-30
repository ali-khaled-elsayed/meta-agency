import Image from "next/image";
import type { CSSProperties } from "react";
import type { Client } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Props = { clients: Client[]; title?: string | null; className?: string };

function LogoItem({ client, hidden }: { client: Client; hidden?: boolean }) {
  const img = client.logo ? (
    <Image
      src={client.logo}
      alt={hidden ? "" : (client.name ?? "")}
      width={320}
      height={160}
      sizes="(min-width: 768px) 288px, 208px"
      className="h-20 w-auto max-w-[13rem] object-contain contrast-125 saturate-125 transition-transform duration-500 group-hover:scale-110 md:h-28 md:max-w-[18rem]"
    />
  ) : (
    <span className="font-display text-3xl font-extrabold tracking-tight transition-colors duration-500 group-hover:text-lavender md:text-5xl">
      {client.name}
    </span>
  );
  return (
    <li className="group flex shrink-0 items-center px-8 md:px-16" aria-hidden={hidden || undefined}>
      {client.website_url && !hidden ? (
        <a href={client.website_url} target="_blank" rel="noopener noreferrer" aria-label={client.name ?? undefined}>
          {img}
        </a>
      ) : (
        img
      )}
    </li>
  );
}

/** Infinite CSS marquee: the list is rendered twice and the track shifts by exactly half its width. */
export function ClientMarquee({ clients, title, className }: Props) {
  if (clients.length === 0) return null;
  const duration = `${Math.max(25, clients.length * 4)}s`;

  return (
    <section className={cn("border-y border-line py-14 md:py-20", className)} aria-label={title ?? undefined}>
      {title && <p className="container-site text-eyebrow mb-10 text-center text-paper/50">{title}</p>}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" dir="ltr">
        <ul
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
          style={{ "--marquee-duration": duration } as CSSProperties}
        >
          {clients.map((c) => (
            <LogoItem key={c.id} client={c} />
          ))}
          {clients.map((c) => (
            <LogoItem key={`dup-${c.id}`} client={c} hidden />
          ))}
        </ul>
      </div>
    </section>
  );
}
