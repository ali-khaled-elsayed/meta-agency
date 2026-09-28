# Meta Egypt Agency — Website Audit

**Audit date:** 27 September 2026
**Scope:** Phase A — audit only. No application code has been written or changed.
**Audited targets:** local workspace `d:\Hossam\meta`, live site <https://meta-egypt-agency.com/>, brand assets supplied via Google Drive.

---

## 1. Executive summary

1. **There is no existing codebase to preserve locally.** The workspace `d:\Hossam\meta` was empty at audit time (no Laravel app, no Next.js app, no migrations, no Filament resources, no git repository). Sections of the brief that ask to "inspect existing Laravel / Next.js / Filament" therefore have nothing to inspect; the new `/backend` + `/frontend` stack will be built from scratch.
2. **The live website is WordPress, not Laravel.** It runs on Hostinger (LiteSpeed + hCDN, PHP 8.3) using the commercial **Pixify** theme (by ThemeXriver) with **Elementor**, **Essential Addons for Elementor**, **Contact Form 7**, **Fluent Forms**, and the theme's **pixify-core** plugin. It is the source of truth for routes and content, and the migration target for redirects.
3. **Most of the live content is unedited theme demo content.** Only a small set of content is genuinely Meta Egypt's (services list, stats, about/mission/vision, contact details, social links, client logos, privacy policy). Blog posts, testimonials, team members, job openings, projects, pricing, "Why choose us" items and the process steps are all Pixify placeholder copy (e.g. "Pixify Enhances User Experience…", "Cameron Williamson", "Mechanical engineering", "Construction Manager", a US office in Brooklyn).
4. **Consequence for the content rule ("do not invent content"):** those placeholder entities must **not** be migrated. The new system will create the tables and Filament resources for them, seed only verified real content, and leave the rest empty (with graceful empty states on the frontend) until the Meta Egypt team supplies real content.
5. **The new logo differs from the live-site logo.** The Drive folder contains a "META™ AGENCY" wordmark; the live site uses an "M + bars" icon with "META EGYPT AGENCY". The live-site logo ("M + bars" with "META EGYPT AGENCY", lavender **`#BBA9FF`** and white) is used as the current brand; the Drive wordmark is kept in `backend/database/seeders/assets/brand/wordmark*.png`.

---

## 2. Local environment

| Tool | Version found | Requirement | OK |
|---|---|---|---|
| PHP | 8.3.25 (NTS, x64) | 8.2+ | Yes |
| Composer | 2.8.11 | 2.x | Yes |
| Node.js | 22.19.0 | 20+ for current Next.js | Yes |
| npm | 10.9.3 | — | Yes |
| MySQL | 8.4.6 (`C:\gigserver\mysql`) | 8.x | Yes |
| Git | 2.51.0 | — | Yes (workspace not yet a repo) |

---

## 3. Live-site technology

| Layer | Finding |
|---|---|
| CMS | WordPress (REST API public at `/wp-json/`) |
| Theme | Pixify (`themes/pixify`) + `plugins/pixify-core` |
| Page builder | Elementor (all main pages use template `elementor_header_footer`) + Essential Addons Lite |
| Forms | Contact Form 7 (forms #5617 contact, #5607 job apply, #5814 team contact); Fluent Forms also installed (unused on audited pages) |
| Hosting | Hostinger (`platform: hostinger`, `server: hcdn`, LiteSpeed cache) |
| Front-end JS (homepage) | 29 script files: jQuery + jQuery Migrate, Bootstrap, Swiper, WOW.js, Feather icons, Nice Select, jQuery Marquee, Magnific Popup, **GSAP + SplitText + CustomEase + ScrollTrigger**, **Lenis**, CounterUp + Waypoints, Touchspin, Elementor runtime, EA general |
| CSS | 30 stylesheets on the homepage |
| Fonts | Google Fonts **Inter** (variable) |
| Favicon | `wp-content/uploads/2025/05/cropped-meta-1-1-scaled-1-32x32.png` |

---

## 4. Current routes

Status codes were checked with live requests on the audit date.

### 4.1 Public pages (WordPress `page`)

| Live URL | Status | Content | Required in new site | New route (see §12 for i18n prefix) |
|---|---|---|---|---|
| `/` | 200 | Mixed real + demo | Yes | `/` |
| `/about/` | 200 | Mostly real | Yes | `/about` |
| `/our-services/` | 200 | Real services list, demo process | Yes | `/our-services` |
| `/services/{slug}/` (11 pages) | 200 | Title only + generic gallery | Yes | `/services/[slug]` |
| `/blog/` | 200 | Demo posts | Yes | `/blog` |
| `/{post-slug}/` (8 posts at root) | 200 | Demo | Yes (structure) | `/blog/[slug]` |
| `/career/` | 200 | Demo benefits + demo jobs | Yes | `/career` |
| `/career/career-details/` | 200 | Single hard-coded demo job | Yes (structure) | `/career/[slug]` |
| `/job-apply/` | 200 | CF7 application form | Yes | `/job-apply` |
| `/our-clients/` | 200 | Client logo grid | Yes | `/our-clients` |
| `/contact/` | 200 | Real contact info + CF7 form | Yes | `/contact` |
| `/privacy-policy/` | 200 | **Real** Meta Agency privacy policy | Keep | `/privacy-policy` (CMS page) |
| `/our-projects/` | 200 | Demo projects | Replace | `/projects` |
| `/projects/market-analysis/` | 200 | Demo project | Replace | `/projects/[slug]` |
| `/our-team/` | 200 | Demo team | Replace | merged into `/about` (team section) |
| `/teams/marvin-mckinney/` | 200 | Demo team member | Drop | redirect → `/about` |
| `/pricing/` | 200 | Demo pricing ($199/$299…) | Drop unless client confirms | redirect → `/contact` |
| `/blog-grid/`, `/blog-left-sidebar/`, `/blog-right-sidebar/` | 200 | Theme demo layouts | Drop | redirect → `/blog` |

### 4.2 Archives and other indexed URLs

| Live URL | Status | Disposition |
|---|---|---|
| `/category/{slug}/` | 200 | redirect → `/blog?category={slug}` |
| `/tag/{slug}/` | 200 | redirect → `/blog` |
| `/services/` , `/projects/`, `/teams/` (CPT archives) | 200 | redirect → `/our-services`, `/projects`, `/about` |
| `/career-details/` | 301 | redirect → `/career` |
| `/services/strategic-planning/` | 301 (linked from theme, not a real service) | redirect → `/our-services` |
| `/tf-header/*` (18 URLs), `/tf-footer/*` (9 URLs) | in sitemap | theme internals; redirect → `/` (or 410) |
| `/ar/` | 404 | no Arabic version exists today |
| `/wp-admin/`, `/wp-json/*`, `/?s=` | — | not carried over |

### 4.3 Navigation as rendered

Primary menu: Home, About, Services, Blog, Contact. Off-canvas / mobile menu: Home, About, Services, Blog, Career, Job Apply, Our Clients, Contact. Footer "Useful Pages": services, About, Blog, Contact. Footer legal links "Terms of Service" and "Legal Info" point nowhere (no such pages exist).

---

## 5. Content inventory — real vs placeholder

Full extracted text of every page is saved in `docs/audit-source/*.txt` for use when writing seeders.

### 5.1 Verified real content (safe to migrate)

**Positioning (About page)**
- "A 360 agency covering everything and anything marketing and advertising, swinging branches and building brands."
- Who we are: "Experience makes difference, and with our pride in our team's experience and professionalism. We are proud of the number of our clients to continue our efforts to inspire those around us with our vision, since we believe that radical change stems from infrastructure so we can see a different result that you have to recognize the nucleus of your project."
- Why Meta: real-estate-focused paragraph ("we understand that the real estate industry demands a unique and tailored approach to marketing…") and team paragraph ("Our team comprises experienced professionals…").
- Mission: "We help businesses grow by delivering smart, results-driven marketing solutions that connect, engage, and convert."
- Vision: "To empower brands through bold strategies, creative storytelling, and digital innovation that drives lasting impact."

**Statistics**

| Value | Label | Where |
|---|---|---|
| 13+ | Years of Experience | Home, About |
| 25+ | Projects Worldwide | Home, About |
| 93+ | Clients Worldwide | Home |
| 170+ | "Satisfied clients from 170+ organizations in different fields" | Home, Our Team (conflicts with 93+, see §10) |

**Services (11, in live display order)**

| # | Title (as displayed) | Live slug |
|---|---|---|
| 01 | Strategic Branding & Positioning | `strategic-branding` |
| 02 | Digital Marketing Excellence | `digital-marketing` |
| 03 | Web Development & Mobile Apps | `web-development-mobile-apps` |
| 04 | Content Creation | `content-creation` |
| 05 | High-Quality Photography | `high-quality-photography` |
| 06 | Innovative Design and Creativity | `innovative-design-and-creativity` |
| 07 | Social Media Campaigns | `social-media-campaigns` |
| 08 | Reputation Management | `reputation-management` |
| 09 | Email Marketing | `email-marketing` |
| 10 | Search Engine Optimization (SEO) | `search-engine-optimization-seo` |
| 11 | Public Relations | `public-relations` |

Each has a one-paragraph description on `/our-services/` (captured verbatim in `docs/audit-source/services.txt`). Service detail pages contain **no** service-specific body copy — only the title, a "Past Projects" heading with nothing under it, and the same generic 8-image gallery on every page. Capabilities, process and related work for detail pages do not exist yet and must be supplied by the client.

**Contact details**
- Email: `info@meta-egypt-agency.com`
- Phone: `+201016566743` (also shown as `01016566743`)
- Offices: **Fifth Settlement** (Egypt, Cairo, Fifth Settlement) and **Zayed** (Egypt, Cairo, Zayed), both with the same phone and email
- Hours: "Sat–Tue: 9 AM to 5 PM, Fri: Closed" (Wed/Thu missing — needs confirmation)

**Social links**
- Facebook: `https://www.facebook.com/share/19Dbfsc6BV/`
- Instagram: `https://www.instagram.com/metaegyagency`
- LinkedIn: `https://www.linkedin.com/company/metaa-agency/`

**Contact form service options:** Social Media Services, Web/App Development, Advertising Services.

**Client logos:** 11 unique PNG logos (white on transparent, no names, no alt text). Downloaded to `docs/brand-assets/clients-from-live-site/`. Client names must be entered in the CMS.

**Privacy policy:** complete, real, 9-section policy for "Meta Agency" (`docs/audit-source/privacy.txt`).

**Brand assets (Google Drive)** — saved to `docs/brand-assets/logo/`:

| File | Size | Description |
|---|---|---|
| `logo-2.png` | 2953×470 | "META™ AGENCY" wordmark, lavender `#B8A9FE`, transparent |
| `logo-1.png` | 2952×470 | Same wordmark, white, transparent (for dark backgrounds) |
| `icon.png` | 506×465 | White icon mark, transparent |
| `live-site-logo.png` | 1600×749 | Old live-site logo ("M" + bars + "META EGYPT AGENCY") for reference |

### 5.2 Placeholder / demo content (must NOT be migrated)

| Area | What the live site shows |
|---|---|
| Blog | 8 Pixify demo posts (2024), demo categories "Clock Fly Strategy" etc., a demo comment by "choicy" |
| Testimonials | "Cameron Williamson", "Marvin McKinney", "Albert Flores" with text naming "Pixify" |
| Team | Marvin McKinney, Jerome Bell, Jenny Wilson, Jacob Jones, john lomka, Wesley Van't Hart, Don Gepulango, Emma Doležal |
| Careers | Benefits with lorem-style text; jobs "Mechanical engineering", "civil engineering", "construction worker", "skyscraper construction"; details page "Construction Manager, New Jersey, $7k–15k" |
| Projects | "HR Development", "Technology Integration", "Market Analysis" (machining/CNC copy) |
| Pricing | Basic $199 / Premium $299 / Advance plans |
| Home "Why choose" | Strategic Planning, Operational Optimization, **Financial Consulting** (consulting-theme copy) |
| "Our Unique Way" | Customer Focus, Data Analytics (duplicated), Agile Management, Market Analysis, Sustainable Practice |
| Process | "Discussions About Project / Start Work With Team / Handover & Save World" with unrelated copy |
| Offices | "Pixify: United States, 129 9th St, Brooklyn", "the londoner, 83 the strand, sliema, malta, +1 917 265 8444, example@email.com" |
| Hero copy | "Comprehensive Business Consulting Services for Growth and Efficiency", "Innovate. Lead Succeed. Thrive." |
| Job form | Consent text names "BB Agency"; source option "ThemeXriver Agency website"; country list only US/Japan/Germany/Australia/Canada |
| Service pages | Breadcrumb "Pixify Services" |

The "Why Meta" (Strategy / Data / Creativity / Execution), process (Discover → Optimization) and testimonial sections in the new design need real copy from Meta Egypt. Until then they will be CMS-driven and hidden when empty.

---

## 6. Current components (theme sections)

Pixify/Elementor sections in use, for reference when designing replacements (not reused — the new frontend is original):

- Top header + sticky header, search overlay, off-canvas menu with contact block
- Hero with stats (13+ / 25+ / 93+) and client logo marquee (jQuery Marquee)
- "Know about us" intro
- Numbered service slider (01 / 11 … Swiper)
- "Why choose" icon features, "Our unique way" features
- Office locations cards with earth image
- Testimonial slider
- Blog cards (3 latest)
- Contact form section ("Get in touch")
- CTA band "Let's Build Together"
- Footer with useful pages, phone, copyright "©2024, Meta Agency"

---

## 7. Current API endpoints

There is no custom API. The only programmatic interface is the stock WordPress REST API:

| Endpoint | Public | Notes |
|---|---|---|
| `/wp-json/wp/v2/pages` | Yes | 16 pages |
| `/wp-json/wp/v2/posts` | Yes | 8 demo posts |
| `/wp-json/wp/v2/categories` | Yes | 7 categories |
| `/wp-json/wp/v2/media` | Yes | media library |
| `services`, `projects`, `teams` CPTs | **Not** exposed in REST (404) | only visible as HTML |
| `our_past_projects` | Yes | empty |
| CF7 submission endpoints | Yes | `/wp-json/contact-form-7/v1/...` |

---

## 8. Current data model (WordPress)

| WP type | Count | New-system equivalent |
|---|---|---|
| `page` | 16 | `Page` (only privacy policy + static page SEO) |
| `post` | 8 (demo) | `BlogPost` |
| `category` / `post_tag` | 7 / ~10 (demo) | `BlogCategory` (tags optional) |
| `services` CPT | 11 | `Service` |
| `projects` CPT | 1 (demo) | `Project` |
| `teams` CPT | 1 detail page (demo) | `TeamMember` |
| `tf-header` / `tf-footer` | 27 (theme internals) | none — replaced by `SiteSetting` + code |
| CF7 submissions | stored only in email (CF7 does not store by default) | `ContactMessage`, `JobApplication` |
| Users | exposed via `wp-sitemap-users-1.xml` | `User` (admin only, never public) |

**Filament resources:** none exist (no Laravel app).
**Authentication:** WordPress admin only; no public accounts. The new system needs only admin authentication (Filament) — no public login is required by the current functionality.

---

## 9. Forms

### 9.1 Contact form (CF7 #5617 — used on Home, Contact, Our Team)

| Field | Type | Notes |
|---|---|---|
| `age` | radio | misnamed; actually "What can we help you with?" — Social Media Services / Web/App Development / Advertising Services |
| `text-613` | text | name |
| `tel-613` | tel | phone |
| `email-613` | email | email |
| `textarea-481` | textarea | message |

### 9.2 Job application (CF7 #5607 — `/job-apply/`)

First name, last name, email, phone, address, city, province, postal code, country (select), cover letter (file), resume (file), date available, desired pay, website/portfolio, LinkedIn URL, European time zone (yes/no), English level (Native/Bilingual/Professional/Limited/Elementary), source (Instagram/LinkedIn/ThemeXriver/Glassdoor-Indeed/Other), consent checkbox.

Not linked to a specific job; no position field.

### 9.3 Team member contact (CF7 #5814) — full name, company, phone, email, message. Demo page only; will not be carried over.

### 9.4 Search (`?s=`) in header and blog sidebar — WordPress search. Replaced by blog search in the new site.

### 9.5 Blog comments — enabled with a demo comment. Not in scope for the new site unless requested.

---

## 10. Problems found

### Content and brand
1. Roughly 70% of visible copy is theme demo text, including references to competitors/other brands ("Pixify", "BB Agency", "ThemeXriver").
2. Inconsistent brand name: "Meta Egypt Agency", "Meta Agency", "META Agency"; new logo reads "META AGENCY".
3. Conflicting client figures: "93+ Clients Worldwide" vs "170+ organizations".
4. Service descriptions for Web Development, Content Creation, Photography, Social Media, Reputation, Email, SEO and PR are written exclusively for **real estate**, while the About page describes a general 360 agency. Positioning needs confirmation.
5. Service detail pages are empty shells.
6. Office hours omit Wednesday and Thursday.
7. Copyright year is stale (©2024).

### SEO
8. No meta descriptions on any page; no OpenGraph or Twitter tags.
9. No structured data (0 JSON-LD blocks) — no Organization, Service, or Article schema.
10. Homepage has **no `<h1>`**.
11. Sitemap indexes 27 theme-internal URLs (`tf-header`, `tf-footer`), 3 demo blog-layout pages, demo posts, and the users sitemap.
12. Blog posts live at the site root, not under `/blog/`.
13. No `hreflang`, no Arabic version.

### Accessibility
14. 44 `<img>` elements without alt text on the homepage; all client logos have empty alt.
15. Form field names are meaningless (`age`, `text-613`), and the service radio group has no proper legend.
16. Missing heading hierarchy on the homepage.

### Security and privacy
17. A blog post author displays a personal Gmail address (`www.hossam4444@gmail.com`) as the author name.
18. WordPress user list is published in `wp-sitemap-users-1.xml`.
19. Job-application uploads go through CF7 with no visible file-type or size limits on the form; applications are not stored in a database.
20. Two form plugins installed (CF7 and Fluent Forms) — unnecessary attack surface.

### Performance
21. 29 JS files and 30 stylesheets on the homepage, with jQuery plus GSAP plus Lenis plus WOW plus Waypoints — heavy and overlapping.
22. Large uncompressed JPGs (`-scaled.jpg` stock imagery) and PNG logos; homepage HTML is 170 KB.
23. The same generic stock gallery is loaded on all 11 service pages.

### Functional
24. Job application is not tied to a job posting.
25. Career detail is a single hard-coded page rather than per-job pages.
26. Footer links "Terms of Service" and "Legal Info" are dead.

---

## 11. Recommended architecture

### 11.1 Repository layout

```
/backend        Laravel 11 API + Filament 4 admin (PHP 8.2+, MySQL)
/frontend       Next.js (App Router, TypeScript, Tailwind CSS)
/docs           audit, decisions, brand assets, extracted source content
```

Initialise a git repository at the root with a `.gitignore` that excludes `.env*`, `vendor/`, `node_modules/`, `.next/`, `storage/*` runtime files.

### 11.2 Backend (Laravel 11 + Filament 4)

- **Models:** `User`, `Page`, `HomeSection`, `Service`, `Project`, `Client`, `ClientCategory` (optional), `Testimonial`, `BlogCategory`, `BlogPost`, `TeamMember`, `Job`, `JobApplication`, `ContactMessage`, `Office`, `Faq`, `Statistic`, `SiteSetting`, `SocialLink`, `Media` (via Spatie Media Library for conversions and responsive images).
- **Translatable fields** (`title`, `description`, `body`, SEO fields…) stored as JSON via `spatie/laravel-translatable`, with `en` and `ar` keys.
- **Shared traits:** `HasSeo` (meta title/description, OG image, canonical override, robots), `HasStatus` (draft/published, `published_at`), `Sortable` (`sort_order`).
- **Home page builder:** `HomeSection` rows (type, enabled, sort order, translatable title/description, JSON settings, relations to selected services/projects/testimonials). Filament uses a reorderable table plus type-specific form schemas.
- **Statistics** as their own model (value, suffix, label) so 13+ / 25+ / 93+ come from the API and are editable.
- **Structure:** Form Requests for validation, API Resources for every response, thin controllers, Services for side effects (mail, file storage), Policies for admin authorisation. Repositories only where queries are reused.
- **Public API:** read-only, cached, versioned under `/api/v1`, locale via `?locale=` or `Accept-Language`. Write endpoints (`POST /contact`, `POST /job-applications`) are rate-limited and validated; honeypot + optional Turnstile/reCAPTCHA.
- **Uploads:** CVs stored on a private disk (never public URLs), whitelisted `pdf/doc/docx`, MIME sniffing, max size (e.g. 5 MB), randomised filenames; admin download through a signed, authorised route.
- **Notifications:** queued mail to the address configured in `SiteSetting` on every contact message and application; auto-reply to the sender (optional).
- **Rich text:** sanitised on save (HTML Purifier) before being exposed through the API.
- **Sanctum:** only needed if a future authenticated API is added; Filament uses session auth. Not exposed to the public frontend.

### 11.3 Planned API endpoints

```
GET  /api/v1/settings              site settings, social links, offices, navigation, statistics
GET  /api/v1/pages/{slug}          page SEO + content (home returns ordered sections)
GET  /api/v1/services              GET /api/v1/services/{slug}
GET  /api/v1/projects              GET /api/v1/projects/{slug}
GET  /api/v1/clients
GET  /api/v1/testimonials
GET  /api/v1/blog                  ?category=&search=&page=
GET  /api/v1/blog/categories       GET /api/v1/blog/{slug}
GET  /api/v1/jobs                  GET /api/v1/jobs/{slug}
GET  /api/v1/team
GET  /api/v1/faqs
GET  /api/v1/redirects             legacy redirect map for Next.js middleware
POST /api/v1/contact
POST /api/v1/job-applications      multipart
```

Consistent envelope: `{ "data": …, "meta": { … } }` for success, Laravel's standard `{ "message", "errors" }` for 422.

### 11.4 Frontend (Next.js App Router)

- Routes under `app/[locale]/…` with `en` (LTR) and `ar` (RTL); `dir` and fonts set per locale in the locale layout.
- Server Components fetch from the API with ISR (`revalidate`) and on-demand revalidation triggered by Laravel when content is saved in Filament.
- Client Components only where interaction is needed (animations, forms, cursor, sliders).
- `src/lib/api/` typed API client; `src/lib/animations/` shared motion utilities and tokens; `src/components/{layout,navigation,footer,hero,sections,services,projects,blog,careers,contact,testimonials,animations,ui}`.
- Motion stack: Motion (Framer Motion) for component and page transitions, GSAP ScrollTrigger for scroll-driven sections, Lenis for smooth scrolling (disabled when `prefers-reduced-motion` is set), Swiper only for the testimonial slider if a native solution is insufficient.
- Fonts via `next/font`: a display grotesk for headlines, Inter for body (already the live-site font), and an Arabic pairing (e.g. IBM Plex Sans Arabic / Alexandria) for `ar`.
- SEO via the Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD for Organization, Service, and Article.

### 11.5 Localization

Today the site is English-only (`lang="en-US"`). Proposed strategy: prefixed locales `/en/...` and `/ar/...`, with unprefixed URLs redirecting to `/en/...` (or to the browser's preferred locale). Arabic content fields exist from day one but can be empty; the frontend falls back to English per field and marks the page `noindex` for `ar` when no Arabic translation exists.

### 11.6 Redirect plan (301)

| Old | New |
|---|---|
| `/{post-slug}/` (8 demo posts) | `/en/blog` (posts are not migrated) |
| `/category/{slug}/`, `/tag/{slug}/` | `/en/blog` |
| `/career/career-details/`, `/career-details/` | `/en/career` |
| `/our-projects/`, `/projects/`, `/projects/market-analysis/` | `/en/projects` |
| `/our-team/`, `/teams/`, `/teams/{slug}/` | `/en/about` |
| `/pricing/` | `/en/contact` |
| `/blog-grid/`, `/blog-left-sidebar/`, `/blog-right-sidebar/` | `/en/blog` |
| `/services/`, `/services/strategic-planning/` | `/en/our-services` |
| `/tf-header/*`, `/tf-footer/*` | `/en` |
| `/about/`, `/contact/`, etc. (trailing slash) | `/en/about`, `/en/contact`, … |
| `/services/{slug}/` | `/en/services/{slug}` (slugs preserved) |

Redirects will be stored in the database (editable in Filament) and applied by Next.js middleware, with a static fallback list in `next.config` for the legacy WordPress URLs.

### 11.7 Content migration plan

Seeders will contain only the verified real content from §5.1: 11 services with their descriptions, 3 statistics, 2 offices, contact settings, 3 social links, 11 client logos (names blank until provided), About/mission/vision copy, contact-form service options, privacy policy, and the new logo. Blog, testimonials, team, jobs and projects are created empty. Factories generate fake data **only** for tests and local development, never in the production seeder.

---

## 12. Questions for Meta Egypt before content-dependent phases

1. Should the brand name in the new site be "Meta Egypt Agency" or "Meta Agency" (as on the new logo)?
2. Which client figure is correct: 93+ clients or 170+ organizations?
3. Is the agency positioned for real estate specifically, or as a general 360 agency? (Service copy says real estate; About says general.)
4. Names (and optional categories/URLs) for the 11 client logos.
5. Real testimonials, team members, projects/case studies, open jobs, and blog articles — or confirm these sections launch empty/hidden.
6. Service-specific detail copy (capabilities, process, imagery) for all 11 services.
7. Correct office hours (Wednesday/Thursday).
8. Hero video or photography to use — current imagery is generic stock.
9. Keep `/pricing`? Keep blog comments?
10. Notification email address(es) for contact messages and job applications.
11. Production hosting target for Laravel and Next.js (the current Hostinger shared plan cannot run Node.js/Next.js server rendering; a VPS or split hosting such as Vercel + Hostinger/Forge will be needed).

---

### Decisions confirmed (27 Sep 2026)

- **Brand name:** "Meta Egypt Agency" in titles, footer and SEO, using the new META AGENCY wordmark.
- **Demo-content sections** (testimonials, team, projects, jobs, blog): fully built, nothing seeded, hidden on the frontend until real content is published in Filament.
- **Localization:** prefixed `/en/...` and `/ar/...`; all legacy URLs 301 to their `/en/...` equivalents.

---

## 13. Next phase

Phase B (design system): scaffold `/backend` and `/frontend`, set up design and animation tokens from the brand lavender `#B8A9FE`, typography, buttons, header, mobile navigation, footer, animation primitives, page transitions, preloader and custom cursor.

