import type { Category, Company, Job, GlobalSettings } from "./types";

const API_KEY = import.meta.env.VITE_CS_API_KEY as string;
const DELIVERY_TOKEN = import.meta.env.VITE_CS_DELIVERY_TOKEN as string;
const ENVIRONMENT = import.meta.env.VITE_CS_ENV as string;
const BASE_URL = `https://cdn.contentstack.io/v3`;

// ─── Raw shapes ───────────────────────────────────────────────────────────────

interface CSFile { url: string }
interface CSLink { href: string; title: string }

interface CSCategoryEntry {
  uid: string; url: string; title: string;
  short_description: string;
  category_icon?: CSFile;
  featured_category: boolean;
}

interface CSCompanyEntry {
  uid: string; url: string; title: string;
  company_logo?: CSFile;
  company_description: string;
  industry: string;
  company_website?: CSLink;
  headquarters: string;
}

// Jobs reference company/category as { uid: string } only — no nested data
interface CSJobEntry {
  uid: string; url: string; title: string;
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
  responsibilities: string;
  requirements: string;
  preferred_qualifications: string;
  job_status: string;
  featured_job: boolean;
}

interface CSGlobalSettingsEntry {
  uid: string;
  website_logo?: CSFile;
  navigation_links: { label: string; url: string }[];
  footer_description: string;
  footer_links: { label: string; url: string }[];
  social_links: { platform: string; url: string }[];
  copyright_text: string;
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function csGet<T>(
  contentType: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const url = new URL(`${BASE_URL}/content_types/${contentType}/entries`);
  url.searchParams.set("environment", ENVIRONMENT);
  url.searchParams.set("locale", "en-us");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      api_key: API_KEY,
      access_token: DELIVERY_TOKEN,
    },
  });

  if (!res.ok) {
    console.error(
      `Contentstack error [${contentType}]:`,
      res.status,
      await res.text()
    );
    return [];
  }

  const data = await res.json();
  return (data.entries ?? []) as T[];
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function slugFrom(entry: { url?: string; uid: string }): string {
  if (entry.url) return entry.url.replace(/^\//, "");
  return entry.uid;
}

// ─── Transforms ───────────────────────────────────────────────────────────────

function transformCategory(e: CSCategoryEntry): Category {
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    shortDescription: e.short_description ?? "",
    icon: e.category_icon?.url ?? "🏢",
    featured: e.featured_category ?? false,
    jobCount: 0,
  };
}

function transformCompany(e: CSCompanyEntry): Company {
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    logo:
      e.company_logo?.url ??
      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(e.title)}&backgroundColor=1e293b`,
    description: e.company_description ?? "",
    industry: e.industry ?? "",
    website: e.company_website?.href ?? "#",
    headquarters: e.headquarters ?? "",
  };
}

function splitLines(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function transformJob(
  e: CSJobEntry,
  categoryMap: Map<string, Category>,
  companyMap: Map<string, Company>
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
      ? e.skills.split(",").map((s) => s.trim()).filter(Boolean)
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
  // Fetch all three in parallel — NO include params on jobs
  const [rawJobs, categories, companies] = await Promise.all([
    csGet<CSJobEntry>("job"),
    fetchCategories(),
    fetchCompanies(),
  ]);

  // Build lookup maps by UID for O(1) access
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

  return {
    logo: entry.website_logo?.url ?? "Mercor",
    navLinks: entry.navigation_links ?? [],
    footerDescription: entry.footer_description ?? "",
    footerLinks: entry.footer_links ?? [],
    socialLinks: entry.social_links ?? [],
    copyrightText: entry.copyright_text ?? "",
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

export function categoryBySlug(
  categories: Category[],
  slug: string
): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function similarJobs(
  jobs: Job[],
  jobId: string,
  categorySlug: string,
  limit = 3
): Job[] {
  return openJobs(jobs)
    .filter((j) => j.category.slug === categorySlug && j.id !== jobId)
    .slice(0, limit);
}

export function jobsWithCounts(
  jobs: Job[],
  categories: Category[]
): Category[] {
  return categories.map((cat) => ({
    ...cat,
    jobCount: openJobs(jobs).filter((j) => j.category.slug === cat.slug).length,
  }));
}
