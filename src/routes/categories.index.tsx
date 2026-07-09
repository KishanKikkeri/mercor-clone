import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CategoryCard } from "@/components/CategoryCard";
import { fetchCategories, fetchJobs, jobsWithCounts } from "@/lib/contentstack";

export const Route = createFileRoute("/categories/")({
  loader: async () => {
    const [categories, jobs] = await Promise.all([fetchCategories(), fetchJobs()]);
    return { categories: jobsWithCounts(jobs, categories) };
  },
  head: () => ({
    meta: [
      { title: "Categories — Mercor" },
      {
        name: "description",
        content: "Browse open roles by category. Find opportunities based on your skills and interests.",
      },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
} as any);

function CategoriesPage() {
  const { categories } = (Route as any).useLoaderData();

  return (
    <div>
      <PageHero
        eyebrow="Categories"
        title="Find opportunities based on your skills and interests."
        subtitle="Explore every discipline hiring on Mercor right now."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <p className="text-slate-400">No categories available yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c: any) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
