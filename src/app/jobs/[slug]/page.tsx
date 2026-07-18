import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Briefcase, Clock, TrendingUp, DollarSign } from "lucide-react";
import { ApplyButton } from "@/components/ApplyButton";
import { SkillsList } from "@/components/SkillsList";
import { CompanyInfo } from "@/components/CompanyInfo";
import { JobCard } from "@/components/JobCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TrackJobView } from "@/components/TrackJobView";
import { fetchJobs, jobBySlug, similarJobs } from "@/lib/contentstack";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Cache page for up to 60 seconds

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const jobs = await fetchJobs().catch(() => []);
  const job = jobBySlug(jobs, slug);
  return {
    title: job ? `${job.title} at ${job.company.name} — TalentBloom` : "Role Not Found",
    description: job ? job.shortDescription : "Job details page on TalentBloom",
  };
};

const badgeClass =
  "inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50/40 px-3 py-1 text-xs font-semibold text-purple-700";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 border-b border-purple-50 pb-2">{title}</h2>
      <div className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const jobs = await fetchJobs().catch(() => []);
  const job = jobBySlug(jobs, slug);

  if (!job || job.status !== "Open") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Role not found</h1>
        <p className="mt-2 text-slate-500">This role may have been closed or moved.</p>
        <Link
          href="/jobs"
          className="mt-6 inline-block font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const similar = similarJobs(jobs, job.id, job.category.slug);

  return (
    <div>
      <TrackJobView job={job} />
      <section className="border-b border-purple-100 bg-slate-50/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-16 w-16 rounded-xl border border-purple-50 bg-white object-cover shadow-sm"
              />
              <div>
                <div className="text-sm font-semibold text-purple-600">{job.company.name}</div>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {job.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={badgeClass}>
                    <MapPin className="h-3.5 w-3.5 text-purple-500" />
                    {job.location}
                  </span>
                  <span className={badgeClass}>
                    <Clock className="h-3.5 w-3.5 text-purple-500" />
                    {job.workType}
                  </span>
                  <span className={badgeClass}>
                    <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                    {job.employmentType}
                  </span>
                  <span className={badgeClass}>
                    <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
                    {job.experienceLevel}
                  </span>
                </div>
                {job.salaryText && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    {job.salaryText}
                  </div>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <ApplyButton job={job} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <Section title="About the role">
              <p>{job.aboutTheRole}</p>
            </Section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <Section title="Responsibilities">
                <ul className="list-disc space-y-2 pl-5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </Section>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <Section title="Requirements">
                <ul className="list-disc space-y-2 pl-5">
                  {job.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </Section>
            )}

            {job.preferredQualifications && job.preferredQualifications.length > 0 && (
              <Section title="Preferred qualifications">
                <ul className="list-disc space-y-2 pl-5">
                  {job.preferredQualifications.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </Section>
            )}

            {job.skills && job.skills.length > 0 && (
              <Section title="Skills">
                <SkillsList skills={job.skills} />
              </Section>
            )}

            <div className="pt-4">
              <ApplyButton job={job} />
            </div>
          </div>

          <aside className="space-y-6">
            <CompanyInfo company={job.company} />
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-purple-100 bg-purple-50/10">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <SectionHeader title="Similar roles" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
