import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CategoryCard } from "@/components/CategoryCard";
import { fetchCategories, fetchJobs, jobsWithCounts } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Categories — TalentBloom",
  description: "Browse job opportunities by category on TalentBloom.",
};

export const revalidate = 60; // Cache page for up to 60 seconds

export default async function CategoriesPage() {
  const [cats, jobs] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchJobs().catch(() => []),
  ]);

  const categories = jobsWithCounts(jobs, cats);

  return (
    <div>
      <PageHero
        eyebrow="Categories"
        title="Find opportunities based on your skills and interests."
        subtitle="Explore every discipline hiring on TalentBloom right now."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No categories found. Check back later!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
