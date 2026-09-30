"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import type { Client } from "@/lib/api/types";

const HEX_POINTS = "50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87";

/** Row lengths alternate full / one short so the rows interlock like a honeycomb. */
function toRows<T>(items: T[], cols: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0, r = 0; i < items.length; r++) {
    const size = cols > 1 && r % 2 === 1 ? cols - 1 : cols;
    rows.push(items.slice(i, i + size));
    i += size;
  }
  return rows;
}

function useColumns() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCols(lg.matches ? 4 : 3);
    update();
    lg.addEventListener("change", update);
    return () => lg.removeEventListener("change", update);
  }, []);
  return cols;
}

/**
 * Client logos in a honeycomb. Cells spin up into place as a wave on scroll, float gently, and a lavender
 * pulse travels through the comb's outlines; hovering a cell lights it up and lifts its logo.
 */
export function ClientGrid({ clients, title }: { clients: Client[]; title?: string | null }) {
  const cols = useColumns();
  if (clients.length === 0) return null;

  let index = 0;
  const rows = toRows(clients, cols);

  return (
    <section className="section-y overflow-x-clip" aria-label={title ?? undefined}>
      <div className="container-site">
        {title && (
          <div className="slide-in mb-14 md:mb-20" style={{ "--slide-x": "-10vw" } as CSSProperties}>
            <Eyebrow>{title}</Eyebrow>
          </div>
        )}
        <ul className="honeycomb flex flex-col items-center">
          {rows.map((row, r) => (
            <li key={r} className="honeycomb-row flex justify-center gap-[var(--hex-gap)]">
              {row.map((client, c) => {
                const i = index++;
                return (
                  <div key={client.id} className="hex-cell hex-pop" style={{ "--wave": r + c * 0.6 } as CSSProperties}>
                    <div className="hex-float h-full w-full" style={{ "--i": i } as CSSProperties}>
                      <HexLogo client={client} index={i} />
                    </div>
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HexLogo({ client, index }: { client: Client; index: number }) {
  const body = (
    <>
      <svg viewBox="0 0 100 115.47" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
        <polygon
          points={HEX_POINTS}
          vectorEffect="non-scaling-stroke"
          strokeWidth={2}
          style={{ "--i": index } as CSSProperties}
          className="hex-pulse fill-ink stroke-line transition-[fill,stroke] duration-500"
        />
      </svg>
      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name ?? ""}
          width={400}
          height={280}
          sizes="(min-width: 1024px) 18vw, 30vw"
          className="relative h-[58%] w-[82%] object-contain contrast-125 transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="relative max-w-[82%] text-center font-display text-base font-extrabold leading-tight text-paper transition-colors group-hover:text-lavender sm:text-xl md:text-2xl">
          {client.name}
        </span>
      )}
    </>
  );
  const classes = "hex-hit group relative flex h-full w-full items-center justify-center transition-transform duration-500 ease-[var(--ease-expo)] hover:scale-[1.06]";

  return client.website_url ? (
    <a href={client.website_url} target="_blank" rel="noopener noreferrer" aria-label={client.name ?? undefined} className={classes}>
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  );
}
