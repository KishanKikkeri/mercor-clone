import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { JobCard } from "@/components/JobCard";
import { CTASection } from "@/components/CTASection";
import { TrackHomepage } from "@/components/TrackHomepage";
import {
  fetchCategories,
  fetchJobs,
  featuredCategories,
  featuredJobs,
  jobsWithCounts,
} from "@/lib/contentstack";

export const revalidate = 60; // Cache page for up to 60 seconds

export default async function HomePage() {
  const [categories, jobs] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchJobs().catch(() => []),
  ]);

  const cats = jobsWithCounts(jobs, featuredCategories(categories));
  const featured = featuredJobs(jobs);

  const steps = [
    {
      n: "01",
      title: "Explore Categories",
      body: "Browse open roles by field of interest and discipline.",
    },
    {
      n: "02",
      title: "Find the Right Opportunity",
      body: "Read full job descriptions, team details, and company context.",
    },
    {
      n: "03",
      title: "Apply",
      body: "Click Apply on any role and take the next step in your career.",
    },
  ];

  return (
    <div>
      <TrackHomepage />
      <PageHero
        eyebrow="Now hiring"
        title="Find work that moves you forward."
        subtitle="Discover opportunities at the world's most innovative companies."
        size="lg"
      >
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100 active:scale-[0.98] btn-hover-effect"
        >
          Explore Jobs
        </Link>
        <Link
          href="/categories"
          className="inline-flex items-center rounded-lg border border-purple-100 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-purple-50/50 hover:border-purple-300"
        >
          Browse Categories
        </Link>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          title="Explore by Category"
          subtitle="Find opportunities in the areas that fit your skills and ambitions."
        />
        {cats.length === 0 ? (
          <div className="mt-10 text-center text-slate-500 py-10">No categories found.</div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-purple-50 bg-purple-50/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <SectionHeader
              title="Featured Opportunities"
              subtitle="Hand-picked roles from teams shipping ambitious work."
            />
            <Link
              href="/jobs"
              className="hidden shrink-0 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors sm:inline"
            >
              View all jobs →
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="mt-10 text-center text-slate-500 py-10">No featured jobs found.</div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          title="How It Works"
          subtitle="Three simple steps to your next role."
          align="center"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="font-mono text-sm font-bold text-purple-600">{s.n}</div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.body}</p>
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
