import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { CategoryCard } from "@/components/CategoryCard";
import { fetchCategories, fetchJobs, jobsWithCounts } from "@/lib/contentstack";
import type { Category } from "@/lib/types";

export const Route = createFileRoute("/categories/")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, jobs] = await Promise.all([fetchCategories(), fetchJobs()]);
        setCategories(jobsWithCounts(jobs, cats));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <PageHero eyebrow="Categories" title="Find opportunities based on your skills and interests." subtitle="Explore every discipline hiring on Mercor right now." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-40 rounded-xl border border-slate-800 bg-slate-900 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
