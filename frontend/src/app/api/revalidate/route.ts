import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_TAGS = new Set([
  "settings",
  "pages",
  "home",
  "services",
  "projects",
  "clients",
  "testimonials",
  "blog",
  "jobs",
  "team",
  "highlights",
  "faqs",
  "redirects",
]);

function secretMatches(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the Laravel backend after content changes. */
export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let tags: unknown;
  try {
    tags = ((await request.json()) as { tags?: unknown }).tags;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(tags)) {
    return NextResponse.json({ message: "`tags` must be an array" }, { status: 422 });
  }

  const valid = [...new Set(tags.filter((t): t is string => typeof t === "string" && ALLOWED_TAGS.has(t)))];
  for (const tag of valid) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: valid, now: Date.now() });
}
