import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import {
  JobFilters,
  defaultJobFilters,
  type JobFiltersState,
} from "@/components/JobFilters";
import { openJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Browse Jobs — Mercor" },
      {
        name: "description",
        content:
          "Browse open roles across engineering, AI, design, product, and marketing. Filter by category, work type, employment type, and experience level.",
      },
      { property: "og:title", content: "Browse Jobs — Mercor" },
      {
        property: "og:description",
        content: "Filter and find your next role across top companies.",
      },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [filters, setFilters] = useState<JobFiltersState>(defaultJobFilters);
  const all = openJobs();

  const results = useMemo(() => {
    return all.filter((j) => {
      if (filters.query && !j.title.toLowerCase().includes(filters.query.toLowerCase()))
        return false;
      if (filters.category !== "all" && j.category.slug !== filters.category) return false;
      if (filters.workType !== "all" && j.workType !== filters.workType) return false;
      if (filters.employmentType !== "all" && j.employmentType !== filters.employmentType)
        return false;
      if (
        filters.experienceLevel !== "all" &&
        j.experienceLevel !== filters.experienceLevel
      )
        return false;
      return true;
    });
  }, [all, filters]);

  return (
    <div>
      <PageHero
        eyebrow="Open roles"
        title="Browse every opportunity."
        subtitle="Filter across categories, work types, and experience levels to find your fit."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <JobFilters value={filters} onChange={setFilters} />

          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing <span className="font-medium text-white">{results.length}</span>{" "}
                {results.length === 1 ? "job" : "jobs"}
              </p>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="No jobs match your filters"
                description="Try clearing filters or broadening your search."
                action={
                  <button
                    onClick={() => setFilters(defaultJobFilters)}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-900"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {results.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
