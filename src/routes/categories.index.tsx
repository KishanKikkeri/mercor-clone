import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/mock-data";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Categories — Mercor" },
      {
        name: "description",
        content:
          "Browse open roles by category. Find opportunities based on your skills and interests across engineering, AI, design, product, and marketing.",
      },
      { property: "og:title", content: "Categories — Mercor" },
      {
        property: "og:description",
        content: "Find opportunities based on your skills and interests.",
      },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Categories"
        title="Find opportunities based on your skills and interests."
        subtitle="Explore every discipline hiring on Mercor right now."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
