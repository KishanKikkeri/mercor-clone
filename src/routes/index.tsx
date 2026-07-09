import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { JobCard } from "@/components/JobCard";
import { CTASection } from "@/components/CTASection";
import {
  fetchCategories,
  fetchJobs,
  featuredCategories,
  featuredJobs,
  jobsWithCounts,
} from "@/lib/contentstack";

export const Route = createFileRoute("/")(({
  loader: async () => {
    const [categories, jobs] = await Promise.all([fetchCategories(), fetchJobs()]);
    const cats = jobsWithCounts(jobs, featuredCategories(categories));
    const featured = featuredJobs(jobs);
    return { cats, featured };
  },
  head: () => ({
    meta: [
      { title: "Mercor — Find work that moves you forward" },
      {
        name: "description",
        content:
          "Discover opportunities at the world's most innovative companies. Browse open roles across engineering, AI, design, product, and marketing.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
} as any));

const steps = [
  { n: "01", title: "Explore Categories", body: "Browse open roles by field of interest and discipline." },
  { n: "02", title: "Find the Right Opportunity", body: "Read full job descriptions, team details, and company context." },
  { n: "03", title: "Apply", body: "Click Apply on any role and take the next step in your career." },
];

function HomePage() {
  const { cats, featured } = (Route as any).useLoaderData();

  return (
    <div>
      <PageHero
        eyebrow="Now hiring"
        title="Find work that moves you forward."
        subtitle="Discover opportunities at the world's most innovative companies."
        size="lg"
      >
        <Link
          to="/jobs"
          className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Explore Jobs
        </Link>
        <Link
          to="/categories"
          className="inline-flex items-center rounded-md border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
        >
          Browse Categories
        </Link>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader
          title="Explore by Category"
          subtitle="Find opportunities in the areas that fit your skills and ambitions."
        />
        {cats.length === 0 ? (
          <p className="mt-10 text-slate-400">No categories available yet.</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c: any) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-slate-800 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <SectionHeader
              title="Featured Opportunities"
              subtitle="Hand-picked roles from teams shipping ambitious work."
            />
            <Link
              to="/jobs"
              className="hidden shrink-0 text-sm font-medium text-blue-400 hover:text-blue-300 sm:inline"
            >
              View all jobs →
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-10 text-slate-400">No featured jobs yet.</p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((j: any) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader title="How It Works" subtitle="Three simple steps to your next role." align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="font-mono text-sm text-blue-400">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        headline="Ready to find your next role?"
        subtitle="Browse open roles across every category."
        buttonLabel="Browse All Jobs"
        buttonHref="/jobs"
      />
    </div>
  );
}
