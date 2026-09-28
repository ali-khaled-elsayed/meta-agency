export type Seo = {
  title: string | null;
  description: string | null;
  image: string | null;
  noindex: boolean;
};

export type Cta = { label: string; url: string };

export type Statistic = {
  id: number;
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string | null;
};

export type Office = {
  id: number;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  map_url: string | null;
  hours: string | null;
  is_primary: boolean;
};

export type SocialLink = { platform: string; url: string };

export type Service = {
  id: number;
  slug: string;
  title: string | null;
  short_title: string | null;
  excerpt: string | null;
  image: string | null;
  is_featured: boolean;
  order: number;
};

export type ServiceLink = { slug: string; title: string | null };

export type ProcessStep = { title: string; description: string | null };

export type Project = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  year: number | null;
  image: string | null;
  video_url: string | null;
  is_featured: boolean;
  client?: { name: string | null; logo: string | null } | null;
  service?: ServiceLink | null;
};

export type ProjectDetail = Project & {
  body: string | null;
  gallery: string[];
  seo: Seo;
};

export type ServiceDetail = Service & {
  body: string | null;
  capabilities: string[];
  process: ProcessStep[];
  video_url: string | null;
  gallery: string[];
  projects: Project[];
  seo: Seo;
};

export type ServiceMeta = {
  index: number;
  total: number;
  previous: ServiceLink | null;
  next: ServiceLink | null;
};

export type Client = {
  id: number;
  name: string | null;
  logo: string | null;
  website_url: string | null;
  category: string | null;
  is_featured: boolean;
};

export type Testimonial = {
  id: number;
  quote: string | null;
  author_name: string;
  author_position: string | null;
  company: string | null;
  avatar: string | null;
};

export type TeamMember = {
  id: number;
  name: string | null;
  position: string | null;
  bio: string | null;
  photo: string | null;
  linkedin_url: string | null;
};

export type HighlightGroup = "why_meta" | "values" | "career_benefits" | "career_culture";

export type Highlight = {
  id: number;
  group: HighlightGroup;
  title: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
};

export type Faq = { id: number; category: string | null; question: string | null; answer: string | null };

export type BlogCategory = { id: number; slug: string; name: string | null; posts_count?: number };

export type BlogPost = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  is_featured: boolean;
  category?: BlogCategory | null;
};

export type BlogPostDetail = BlogPost & { body: string | null; updated_at: string | null; seo: Seo };

export type JobPosting = {
  id: number;
  slug: string;
  title: string | null;
  department: string | null;
  location: string | null;
  employment_type: string;
  employment_type_label: string;
  workplace_type: string;
  workplace_type_label: string;
  summary: string | null;
  published_at: string | null;
  closes_at: string | null;
};

export type JobPostingDetail = JobPosting & {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  seo: Seo;
};

export type Page = {
  slug: string;
  title: string | null;
  eyebrow: string | null;
  intro: string | null;
  body: string | null;
  hero_image: string | null;
  hero_video_url: string | null;
  updated_at: string | null;
  seo: Seo;
};

type SectionBase = {
  id: number;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  video_url: string | null;
  cta: Cta | null;
  secondary_cta: Cta | null;
  statistics: Statistic[];
};

export type HomeSection =
  | (SectionBase & { type: "hero" | "introduction" | "cta"; items: never[] })
  | (SectionBase & { type: "client_marquee"; items: Client[] })
  | (SectionBase & { type: "statistics"; items: Statistic[] })
  | (SectionBase & { type: "services"; items: Service[] })
  | (SectionBase & { type: "projects"; items: Project[] })
  | (SectionBase & { type: "why_meta"; items: Highlight[] })
  | (SectionBase & { type: "testimonials"; items: Testimonial[] })
  | (SectionBase & { type: "blog"; items: BlogPost[] });

export type HomeSectionType = HomeSection["type"];

export type JobFormFieldMode = "required" | "optional" | "hidden";

export type JobFormField =
  | "city"
  | "country"
  | "portfolio_url"
  | "linkedin_url"
  | "expected_salary"
  | "available_from"
  | "english_level"
  | "source"
  | "message";

export type SiteSettings = {
  site_name: string | null;
  tagline: string | null;
  description: string | null;
  mission: string | null;
  vision: string | null;
  footer_cta: string | null;
  working_hours: string | null;
  contact_service_options: string[] | null;
  budget_options: string[] | null;
  job_source_options: string[] | null;
  english_levels: string[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  hero_video_url: string | null;
  logo: string | null;
  logo_light: string | null;
  logo_icon: string | null;
  default_og_image: string | null;
  job_form_fields: Record<JobFormField, JobFormFieldMode>;
  social_links: SocialLink[];
  offices: Office[];
  statistics: Statistic[];
  services: Service[];
  features: {
    projects: boolean;
    blog: boolean;
    jobs: boolean;
    testimonials: boolean;
    team: boolean;
    clients: boolean;
  };
};

export type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

export type RedirectRule = { from_path: string; to_path: string; status_code: 301 | 302 };
