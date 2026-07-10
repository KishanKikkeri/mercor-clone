import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { fetchCategories, fetchJobs, categoryBySlug, jobsByCategorySlug, jobsWithCounts } from "@/lib/contentstack";
import type { Category, Job } from "@/lib/types";

export const Route = createFileRoute("/categories/$slug")({
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const [category, setCategory] = useState<Category | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [cats, allJobs] = await Promise.all([fetchCategories(), fetchJobs()]);
        const found = categoryBySlug(cats, slug);
        if (!found) { setNotFound(true); setLoading(false); return; }
        const withCounts = jobsWithCounts(allJobs, cats);
        setCategory(withCounts.find((c) => c.slug === slug) ?? found);
        setJobs(jobsByCategorySlug(allJobs, slug));
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-800 mb-4" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map(i => <div key={i} className="h-52 rounded-xl border border-slate-800 bg-slate-900 animate-pulse" />)}
      </div>
    </div>
  );

  if (notFound || !category) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-white">Category not found</h1>
      <p className="mt-2 text-slate-400">The category you're looking for doesn't exist.</p>
      <Link to="/categories" className="mt-6 inline-block text-blue-400 hover:text-blue-300">← Back to Categories</Link>
    </div>
  );

  return (
    <div>
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400">
            <Link to="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
              {category.icon.startsWith("http") ? (
                <img src={category.icon} alt={category.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-3xl">{category.icon}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{category.name}</h1>
              <p className="mt-2 max-w-2xl text-slate-400">{category.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <EmptyState title="No open roles yet" description="There aren't any open roles in this category right now. Check back soon." />
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-400">
              Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
