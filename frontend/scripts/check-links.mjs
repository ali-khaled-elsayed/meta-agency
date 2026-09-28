// Crawls the site from the locale homes and reports internal links/assets that don't resolve.
// Usage: node scripts/check-links.mjs [baseUrl]
const base = new URL(process.argv[2] ?? "http://localhost:3000");
const queue = ["/en", "/ar"];
const seen = new Map();
const broken = [];

const attr = /(?:href|src)="([^"#]+)"/g;

async function check(path, from) {
  if (seen.has(path)) return;
  seen.set(path, null);
  let res = await fetch(new URL(path, base), { redirect: "manual" });
  let status = res.status;
  if (status >= 300 && status < 400) {
    const location = res.headers.get("location");
    res = await fetch(new URL(location, base));
    status = res.status;
  }
  seen.set(path, status);
  if (status >= 400) broken.push({ path, status, from });
  if (!(res.headers.get("content-type") ?? "").includes("text/html") || status >= 400) return;

  const html = await res.text();
  for (const [, raw] of html.matchAll(attr)) {
    const href = raw.replaceAll("&amp;", "&");
    if (/^(mailto:|tel:|data:|javascript:)/.test(href)) continue;
    const url = new URL(href, new URL(path, base));
    if (url.origin !== base.origin) continue;
    queue.push({ path: url.pathname + url.search, from: path });
  }
}

while (queue.length) {
  const item = queue.shift();
  const { path, from } = typeof item === "string" ? { path: item, from: "(start)" } : item;
  await check(path, from);
}

const pages = [...seen.keys()].filter((p) => !p.startsWith("/_next"));
console.log(`Checked ${seen.size} URLs (${pages.length} pages/links).`);
if (broken.length) {
  console.log("Broken:");
  for (const b of broken) console.log(`  ${b.status} ${b.path}  <- ${b.from}`);
  process.exitCode = 1;
} else {
  console.log("No broken internal links.");
}
