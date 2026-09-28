import "server-only";
import type { Locale } from "@/lib/i18n/config";

export const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** Fallback freshness window; content edits also trigger on-demand tag revalidation from the backend. */
const REVALIDATE_SECONDS = 300;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

export function buildUrl(path: string, query: Query = {}): string {
  const url = new URL(`${API_URL}/${path.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/**
 * Fetches a JSON resource from the Laravel API. Returns `null` for 404 so pages can call `notFound()`.
 */
export async function apiGet<T>(
  path: string,
  { locale, query, tags }: { locale: Locale; query?: Query; tags: string[] },
): Promise<T | null> {
  const response = await fetch(buildUrl(path, { ...query, locale }), {
    headers: { Accept: "application/json", "Accept-Language": locale },
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new ApiError(response.status, `API ${response.status} for ${path}`);

  return (await response.json()) as T;
}
