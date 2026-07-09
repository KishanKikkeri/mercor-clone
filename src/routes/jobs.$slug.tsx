import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Briefcase, Clock, TrendingUp, DollarSign } from "lucide-react";
import { ApplyButton } from "@/components/ApplyButton";
import { SkillsList } from "@/components/SkillsList";
import { CompanyInfo } from "@/components/CompanyInfo";
import { JobCard } from "@/components/JobCard";
import { SectionHeader } from "@/components/SectionHeader";
import { jobBySlug, similarJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs/$slug")({
  loader: ({ params }) => {
    const job = jobBySlug(params.slug);
    if (!job || job.status !== "Open") throw notFound();
    const similar = similarJobs(job.id, job.category.slug);
    return { job, similar };
  },
  head: ({ loaderData, params }) => {
    const job = loaderData?.job;
    const title = job ? `${job.title} at ${job.company.name} — Mercor` : "Job — Mercor";
    const desc = job?.shortDescription ?? "Open role on Mercor.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/jobs/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/jobs/${params.slug}` }],
    };
  },
  component: JobDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-white">Role not found</h1>
      <p className="mt-2 text-slate-400">This role may have been closed or moved.</p>
      <Link to="/jobs" className="mt-6 inline-block text-blue-400 hover:text-blue-300">
        ← Back to Jobs
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

const badgeClass =
  "inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 text-slate-300">{children}</div>
    </section>
  );
}

function JobDetailPage() {
  const { job, similar } = Route.useLoaderData();

  return (
    <div>
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-16 w-16 rounded-md border border-slate-800 bg-slate-900 object-cover"
              />
              <div>
                <div className="text-sm text-slate-400">{job.company.name}</div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={badgeClass}>
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span className={badgeClass}>
                    <Clock className="h-3.5 w-3.5" />
                    {job.workType}
                  </span>
                  <span className={badgeClass}>
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.employmentType}
                  </span>
                  <span className={badgeClass}>
                    <TrendingUp className="h-3.5 w-3.5" />
                    {job.experienceLevel}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  {job.salaryText}
                </div>
              </div>
            </div>
            <ApplyButton />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <Section title="About the role">
              <p className="leading-relaxed">{job.aboutTheRole}</p>
            </Section>

            <Section title="Responsibilities">
              <ul className="list-disc space-y-2 pl-5">
                {job.responsibilities.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Section>

            <Section title="Requirements">
              <ul className="list-disc space-y-2 pl-5">
                {job.requirements.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Section>

            <Section title="Preferred qualifications">
              <ul className="list-disc space-y-2 pl-5">
                {job.preferredQualifications.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Section>

            <Section title="Skills">
              <SkillsList skills={job.skills} />
            </Section>

            <div className="pt-4">
              <ApplyButton />
            </div>
          </div>

          <aside className="space-y-4">
            <CompanyInfo company={job.company} />
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-slate-800 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeader title="Similar roles" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((j: import("@/lib/types").Job) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
