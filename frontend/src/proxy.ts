import { NextResponse, type NextRequest } from "next/server";
import type { RedirectRule } from "@/lib/api/types";
import { resolveRedirect } from "@/lib/redirects";

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const TTL_MS = 5 * 60 * 1000;

let cache: { rules: RedirectRule[]; fetchedAt: number } = { rules: [], fetchedAt: 0 };
let inflight: Promise<void> | null = null;

async function refreshRules() {
  try {
    const res = await fetch(`${API_URL}/redirects`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (res.ok) {
      const json = (await res.json()) as { data: RedirectRule[] };
      cache = { rules: json.data ?? [], fetchedAt: Date.now() };
      return;
    }
  } catch {
    // Keep serving the last known rules if the API is briefly unavailable.
  }
  cache = { ...cache, fetchedAt: Date.now() - TTL_MS + 30_000 };
}

async function rules(): Promise<RedirectRule[]> {
  if (Date.now() - cache.fetchedAt > TTL_MS) {
    inflight ??= refreshRules().finally(() => {
      inflight = null;
    });
    await inflight;
  }
  return cache.rules;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const decision = resolveRedirect(pathname, await rules(), request.headers.get("accept-language"));
  if (!decision) return NextResponse.next();

  const url = /^https?:\/\//i.test(decision.location)
    ? new URL(decision.location)
    : new URL(`${decision.location}${search}`, request.url);
  return NextResponse.redirect(url, decision.status);
}

export const config = {
  matcher: [
    // Everything except Next internals, the revalidation API, metadata files and static assets.
    "/((?!_next/|api/|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]{2,5}$).*)",
  ],
};
