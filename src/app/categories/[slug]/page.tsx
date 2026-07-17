import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import {
  fetchCategories,
  fetchJobs,
  categoryBySlug,
  jobsByCategorySlug,
  jobsWithCounts,
} from "@/lib/contentstack";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Cache page for up to 60 seconds

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cats = await fetchCategories().catch(() => []);
  const category = categoryBySlug(cats, slug);
  return {
    title: category ? `${category.name} Jobs — TalentBloom` : "Category Not Found",
    description: category ? category.shortDescription : "Category page on TalentBloom",
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [cats, allJobs] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchJobs().catch(() => []),
  ]);

  const category = categoryBySlug(cats, slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Category not found</h1>
        <p className="mt-2 text-slate-500">The category you're looking for doesn't exist.</p>
        <Link
          href="/categories"
          className="mt-6 inline-block font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          ← Back to Categories
        </Link>
      </div>
    );
  }

  const withCounts = jobsWithCounts(allJobs, cats);
  const updatedCategory = withCounts.find((c) => c.slug === slug) ?? category;
  const jobs = jobsByCategorySlug(allJobs, slug);

  return (
    <div>
      <section className="border-b border-purple-100 bg-slate-50/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link
              href="/categories"
              className="hover:text-purple-600 transition-colors font-medium"
            >
              Categories
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-semibold">{updatedCategory.name}</span>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-purple-50 bg-white text-purple-600 shadow-sm">
              {updatedCategory.icon?.startsWith("http") ? (
                <img
                  src={updatedCategory.icon}
                  alt={updatedCategory.name}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-3xl">{updatedCategory.icon}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {updatedCategory.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500 leading-relaxed">
                {updatedCategory.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <EmptyState
            title="No open roles yet"
            description={`There aren't any open roles in ${updatedCategory.name} right now. Check back soon.`}
          />
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-500 font-medium">
              Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
