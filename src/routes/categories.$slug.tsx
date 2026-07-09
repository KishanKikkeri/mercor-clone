import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { categoryBySlug, jobsByCategorySlug } from "@/lib/mock-data";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    const jobs = jobsByCategorySlug(params.slug);
    return { category, jobs };
  },
  head: ({ loaderData, params }) => {
    const name = loaderData?.category.name ?? "Category";
    return {
      meta: [
        { title: `${name} Jobs — Mercor` },
        {
          name: "description",
          content:
            loaderData?.category.shortDescription ??
            "Explore open roles in this category on Mercor.",
        },
        { property: "og:title", content: `${name} Jobs — Mercor` },
        {
          property: "og:description",
          content: loaderData?.category.shortDescription ?? "",
        },
        { property: "og:url", content: `/categories/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categories/${params.slug}` }],
    };
  },
  component: CategoryDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-white">Category not found</h1>
      <p className="mt-2 text-slate-400">The category you're looking for doesn't exist.</p>
      <Link to="/categories" className="mt-6 inline-block text-blue-400 hover:text-blue-300">
        ← Back to Categories
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  ),
});

function CategoryDetailPage() {
  const { category, jobs } = Route.useLoaderData();

  return (
    <div>
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400">
            <Link to="/categories" className="hover:text-white">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-3xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-400">{category.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <EmptyState
            title="No open roles yet"
            description="There aren't any open roles in this category right now. Check back soon."
          />
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-400">
              Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j: import("@/lib/types").Job) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
