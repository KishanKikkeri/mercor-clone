import type { Category, Company, Job, GlobalSettings, HeroCMS, FeaturedJobsCMS } from "./types";

const API_KEY = (process.env.NEXT_PUBLIC_CS_API_KEY ||
  process.env.VITE_CS_API_KEY ||
  process.env.CONTENTSTACK_API_KEY ||
  "") as string;
const DELIVERY_TOKEN = (process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN ||
  process.env.VITE_CS_DELIVERY_TOKEN ||
  process.env.CONTENTSTACK_DELIVERY_TOKEN ||
  "") as string;
const ENVIRONMENT = (process.env.NEXT_PUBLIC_CS_ENV ||
  process.env.VITE_CS_ENV ||
  process.env.CONTENTSTACK_ENVIRONMENT ||
  "") as string;
const API_HOST = (process.env.NEXT_PUBLIC_CONTENTSTACK_CDN ||
  process.env.CONTENTSTACK_CDN ||
  process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST ||
  process.env.CONTENTSTACK_API_HOST ||
  process.env.VITE_CS_API_HOST ||
  "cdn.contentstack.io") as string;

const cleanHost = API_HOST.replace(/^(https?:\/\/)?/, "https://").replace(/\/+$/, "");
const BASE_URL = cleanHost.endsWith("/v3") ? cleanHost : `${cleanHost}/v3`;

// ─── Raw shapes ───────────────────────────────────────────────────────────────

interface CSLink {
  href: string;
  title: string;
}

interface CSCategoryEntry {
  uid: string;
  url: string;
  title: string;
  short_description: string;
  category_icon?: any;
  featured_category: boolean;
}

interface CSCompanyEntry {
  uid: string;
  url: string;
  title: string;
  company_logo?: any;
  company_description: string;
  industry: string;
  company_website?: CSLink;
  headquarters: string;
}

interface CSJobEntry {
  uid: string;
  url: string;
  title: string;
  short_description: string;
  company: { uid: string }[];
  category: { uid: string }[];
  location: string;
  work_type: string;
  employment_type: string;
  experience_level: string;
  salary_text: string;
  skills: string;
  about_the_role: string;
  responsibilities: any;
  requirements: any;
  preferred_qualifications: any;
  job_status: string;
  featured_job: boolean;
}

interface CSGlobalSettingsEntry {
  uid: string;
  website_logo?: any;
  navigation_links: { label: string; url: string }[];
  footer_description: string;
  footer_links: { label: string; url: string }[];
  social_links: { platform: string; url: string }[];
  copyright_text: string;
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function csGet<T>(contentType: string, params: Record<string, string> = {}): Promise<T[]> {
  if (!API_KEY || !DELIVERY_TOKEN) {
    console.warn(`Contentstack credentials missing for content type: ${contentType}`);
    return [];
  }

  const url = new URL(`${BASE_URL}/content_types/${contentType}/entries`);
  url.searchParams.set("environment", ENVIRONMENT);
  url.searchParams.set("locale", "en-us");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        api_key: API_KEY,
        access_token: DELIVERY_TOKEN,
      },
    });

    if (!res.ok) {
      console.error(`Contentstack error [${contentType}]:`, res.status, await res.text());
      return [];
    }

    const data = await res.json();
    return (data.entries ?? []) as T[];
  } catch (error) {
    console.error(`Contentstack network error [${contentType}]:`, error);
    return [];
  }
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function slugFrom(entry: { url?: string; uid: string }): string {
  if (entry.url) {
    const parts = entry.url.split("/").filter(Boolean);
    return parts[parts.length - 1] || entry.uid;
  }
  return entry.uid;
}

// Helper to extract image URL from various contentstack formats
function getImageUrl(file: any): string | undefined {
  if (!file) return undefined;
  let url: string | undefined;
  if (Array.isArray(file)) {
    url = file[0]?.url;
  } else if (typeof file === "object") {
    url = file.url;
  } else if (typeof file === "string") {
    url = file;
  }
  if (url && url.startsWith("//")) {
    url = `https:${url}`;
  }
  return url;
}

// ─── Transforms ───────────────────────────────────────────────────────────────

function transformCategory(e: CSCategoryEntry): Category {
  const iconUrl = getImageUrl(e.category_icon);
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    shortDescription: e.short_description ?? "",
    icon: iconUrl ?? "🏢",
    featured: e.featured_category ?? false,
    jobCount: 0,
  };
}

function transformCompany(e: CSCompanyEntry): Company {
  const logoUrl = getImageUrl(e.company_logo);
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    logo:
      logoUrl ??
      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(e.title)}&backgroundColor=c084fc`, // soft purple/lavender accent background
    description: e.company_description ?? "",
    industry: e.industry ?? "",
    website: e.company_website?.href ?? "#",
    headquarters: e.headquarters ?? "",
  };
}

function splitLines(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof raw !== "string") {
    raw = String(raw);
  }
  return raw
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);
}

function transformJob(
  e: CSJobEntry,
  categoryMap: Map<string, Category>,
  companyMap: Map<string, Company>,
): Job | null {
  const categoryUid = e.category?.[0]?.uid;
  const companyUid = e.company?.[0]?.uid;

  const category = categoryUid ? categoryMap.get(categoryUid) : undefined;
  const company = companyUid ? companyMap.get(companyUid) : undefined;

  // Skip jobs where references couldn't be resolved
  if (!category || !company) {
    console.warn(`Job "${e.title}" skipped — missing category or company reference`);
    return null;
  }

  return {
    id: e.uid,
    title: e.title,
    slug: slugFrom(e),
    shortDescription: e.short_description ?? "",
    company,
    category,
    location: e.location ?? "",
    workType: (e.work_type as Job["workType"]) ?? "Remote",
    employmentType: (e.employment_type as Job["employmentType"]) ?? "Full-time",
    experienceLevel: (e.experience_level as Job["experienceLevel"]) ?? "Mid Level",
    salaryText: e.salary_text ?? "",
    skills: e.skills
      ? e.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    aboutTheRole: e.about_the_role ?? "",
    responsibilities: splitLines(e.responsibilities),
    requirements: splitLines(e.requirements),
    preferredQualifications: splitLines(e.preferred_qualifications),
    status: (e.job_status as Job["status"]) ?? "Open",
    featured: e.featured_job ?? false,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const entries = await csGet<CSCategoryEntry>("category");
  return entries.map(transformCategory);
}

export async function fetchCompanies(): Promise<Company[]> {
  const entries = await csGet<CSCompanyEntry>("company");
  return entries.map(transformCompany);
}

export async function fetchJobs(): Promise<Job[]> {
  const [rawJobs, categories, companies] = await Promise.all([
    csGet<CSJobEntry>("job"),
    fetchCategories(),
    fetchCompanies(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  return rawJobs
    .map((e) => transformJob(e, categoryMap, companyMap))
    .filter((j): j is Job => j !== null);
}

export async function fetchGlobalSettings(): Promise<GlobalSettings | null> {
  const entries = await csGet<CSGlobalSettingsEntry>("global_settings");
  const entry = entries[0];
  if (!entry) return null;

  const logoUrl = getImageUrl(entry.website_logo);

  return {
    logo: logoUrl ?? "TalentBloom",
    navLinks: entry.navigation_links ?? [],
    footerDescription: entry.footer_description ?? "",
    footerLinks: entry.footer_links ?? [],
    socialLinks: entry.social_links ?? [],
    copyrightText: entry.copyright_text ?? "",
  };
}

interface CSHeroEntry {
  uid: string;
  title: string;
  heading: string;
  subheading?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  background_image?: any;
}

interface CSFeaturedJobsEntry {
  uid: string;
  title: string;
  heading: string;
  description?: string;
  jobs?: CSJobEntry[];
}

export async function getHero(variantAliases?: string[]): Promise<HeroCMS | null> {
  const params: Record<string, string> = {};
  if (variantAliases && variantAliases.length > 0) {
    params["cs_personalize_variant_alias"] = variantAliases.join(",");
  }

  const entries = await csGet<CSHeroEntry>("hero", params);
  const entry = entries[0];
  if (!entry) return null;

  return {
    heading: entry.heading || entry.title || "",
    subheading: entry.subheading || "",
    cta_button_text: entry.cta_button_text || "",
    cta_button_link: entry.cta_button_link || "",
    background_image: getImageUrl(entry.background_image),
  };
}

export async function getFeaturedJobs(): Promise<FeaturedJobsCMS | null> {
  const entries = await csGet<CSFeaturedJobsEntry>("featured_jobs", { "include[]": "jobs" });
  const entry = entries[0];
  if (!entry) return null;

  const [categories, companies] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchCompanies().catch(() => []),
  ]);
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  const resolvedJobs = (entry.jobs ?? [])
    .map((rawJob) => transformJob(rawJob, categoryMap, companyMap))
    .filter((j): j is Job => j !== null);

  return {
    heading: entry.heading || entry.title || "Featured Opportunities",
    description: entry.description || "",
    jobs: resolvedJobs,
  };
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export function openJobs(jobs: Job[]): Job[] {
  return jobs.filter((j) => j.status === "Open");
}

export function featuredJobs(jobs: Job[]): Job[] {
  return openJobs(jobs).filter((j) => j.featured);
}

export function featuredCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.featured);
}

export function jobsByCategorySlug(jobs: Job[], slug: string): Job[] {
  return openJobs(jobs).filter((j) => j.category.slug === slug);
}

export function jobBySlug(jobs: Job[], slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}

export function categoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function similarJobs(jobs: Job[], jobId: string, categorySlug: string, limit = 3): Job[] {
  return openJobs(jobs)
    .filter((j) => j.category.slug === categorySlug && j.id !== jobId)
    .slice(0, limit);
}

export function jobsWithCounts(jobs: Job[], categories: Category[]): Category[] {
  return categories.map((cat) => ({
    ...cat,
    jobCount: openJobs(jobs).filter((j) => j.category.slug === cat.slug).length,
  }));
}
