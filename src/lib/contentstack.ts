/**
 * lib/contentstack.ts
 * All Contentstack API calls — drop-in replacement for mock-data.ts
 * Uses the @contentstack/delivery-sdk (v5)
 */

import type { Category, Company, Job, GlobalSettings } from "./types";

const API_KEY = import.meta.env.VITE_CS_API_KEY as string;
const DELIVERY_TOKEN = import.meta.env.VITE_CS_DELIVERY_TOKEN as string;
const ENVIRONMENT = import.meta.env.VITE_CS_ENV as string;
const BASE_URL = `https://cdn.contentstack.io/v3`;

// ─── Raw Contentstack entry shapes ────────────────────────────────────────────

interface CSFile {
  url: string;
  filename?: string;
}

interface CSLink {
  href: string;
  title: string;
}

interface CSCategoryEntry {
  uid: string;
  url: string;
  title: string;
  slug?: string;
  short_description: string;
  category_icon?: CSFile;
  featured_category: boolean;
}

interface CSCompanyEntry {
  uid: string;
  url: string;
  title: string;
  slug?: string;
  company_logo?: CSFile;
  company_description: string;
  industry: string;
  company_website?: CSLink;
  headquarters: string;
}

interface CSJobEntry {
  uid: string;
  url: string;
  title: string;
  slug?: string;
  short_description: string;
  company: CSCompanyEntry[];
  category: CSCategoryEntry[];
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

async function csGet<T>(contentType: string, params: Record<string, string> = {}): Promise<T[]> {
  const url = new URL(`${BASE_URL}/content_types/${contentType}/entries`);
  url.searchParams.set("environment", ENVIRONMENT);
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
    console.error(`Contentstack error [${contentType}]:`, res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return (data.entries ?? []) as T[];
}

async function csGetSingle<T>(contentType: string, params: Record<string, string> = {}): Promise<T | null> {
  const entries = await csGet<T>(contentType, params);
  return entries[0] ?? null;
}

async function csGetByUrl<T>(contentType: string, entryUrl: string): Promise<T | null> {
  const entries = await csGet<T>(contentType, { "query": JSON.stringify({ url: entryUrl }) });
  return entries[0] ?? null;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function slugFrom(entry: { url?: string; slug?: string; uid: string }): string {
  if (entry.url) return entry.url.replace(/^\//, "");
  if (entry.slug) return entry.slug;
  return entry.uid;
}

// ─── Transform functions ──────────────────────────────────────────────────────

function transformCategory(e: CSCategoryEntry): Category {
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    shortDescription: e.short_description ?? "",
    icon: e.category_icon?.url ?? "🏢",
    featured: e.featured_category ?? false,
    jobCount: 0, // computed separately
  };
}

function transformCompany(e: CSCompanyEntry): Company {
  return {
    id: e.uid,
    name: e.title,
    slug: slugFrom(e),
    logo: e.company_logo?.url ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${e.title}&backgroundColor=1e293b`,
    description: e.company_description ?? "",
    industry: e.industry ?? "",
    website: e.company_website?.href ?? "#",
    headquarters: e.headquarters ?? "",
  };
}

function splitLines(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\n|\//)
    .map((s) => s.trim())
    .filter(Boolean);
}

function transformJob(e: CSJobEntry, allCategories: Category[], allCompanies: Company[]): Job | null {
  const rawCategory = e.category?.[0];
  const rawCompany = e.company?.[0];
  if (!rawCategory || !rawCompany) return null;

  const category = allCategories.find((c) => c.id === rawCategory.uid) ?? transformCategory(rawCategory);
  const company = allCompanies.find((c) => c.id === rawCompany.uid) ?? transformCompany(rawCompany);

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
    skills: e.skills ? e.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
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
  const entries = await csGet<CSCategoryEntry>("category", {
    include_count: "true",
  });
  return entries.map(transformCategory);
}

export async function fetchCompanies(): Promise<Company[]> {
  const entries = await csGet<CSCompanyEntry>("company");
  return entries.map(transformCompany);
}

export async function fetchJobs(): Promise<Job[]> {
  const [rawJobs, categories, companies] = await Promise.all([
    csGet<CSJobEntry>("job", {
      include: "company,category",
      include_reference_content_type_uid: "true",
    }),
    fetchCategories(),
    fetchCompanies(),
  ]);

  return rawJobs
    .map((e) => transformJob(e, categories, companies))
    .filter((j): j is Job => j !== null);
}

export async function fetchGlobalSettings(): Promise<GlobalSettings | null> {
  const entry = await csGetSingle<CSGlobalSettingsEntry>("global_settings");
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

// ─── Selector helpers (mirror mock-data.ts exports) ──────────────────────────

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
