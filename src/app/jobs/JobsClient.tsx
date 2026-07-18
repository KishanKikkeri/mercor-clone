"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { JobFilters, defaultJobFilters, type JobFiltersState } from "@/components/JobFilters";
import type { Job, Category } from "@/lib/types";
import { trackCategorySelect, trackJobSearch } from "@/utils/personalizeHelpers";

interface JobsClientProps {
  initialJobs: Job[];
  categories: Category[];
}

export function JobsClient({ initialJobs, categories }: JobsClientProps) {
  const [filters, setFilters] = useState<JobFiltersState>(defaultJobFilters);

  // Track Category Selection (only when changed and not default "all")
  const prevCategoryRef = useRef(filters.category);
  useEffect(() => {
    if (filters.category !== prevCategoryRef.current) {
      prevCategoryRef.current = filters.category;
      if (filters.category !== "all") {
        const selectedCat = categories.find((c) => c.slug === filters.category);
        if (selectedCat) {
          trackCategorySelect(selectedCat.name);
        }
      }
    }
  }, [filters.category, categories]);

  // Track Job Search (debounced 600ms to determine completed search)
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(filters.query);
    }, 600);
    return () => clearTimeout(handler);
  }, [filters.query]);

  const lastTrackedQueryRef = useRef("");
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed && trimmed !== lastTrackedQueryRef.current) {
      lastTrackedQueryRef.current = trimmed;
      trackJobSearch(trimmed);
    }
  }, [debouncedQuery]);

  const results = useMemo(() => {
    return initialJobs.filter((j) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(query);
        const matchesCompany = j.company.name.toLowerCase().includes(query);
        const matchesSkills = j.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }
      if (filters.category !== "all" && j.category.slug !== filters.category) return false;
      if (filters.workType !== "all" && j.workType !== filters.workType) return false;
      if (filters.employmentType !== "all" && j.employmentType !== filters.employmentType)
        return false;
      if (filters.experienceLevel !== "all" && j.experienceLevel !== filters.experienceLevel)
        return false;
      return true;
    });
  }, [initialJobs, filters]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <JobFilters value={filters} onChange={setFilters} categories={categories} />
      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-900">{results.length}</span>{" "}
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
                className="rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {results.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
