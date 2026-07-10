import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Briefcase, Clock, TrendingUp, DollarSign } from "lucide-react";
import { ApplyButton } from "@/components/ApplyButton";
import { SkillsList } from "@/components/SkillsList";
import { CompanyInfo } from "@/components/CompanyInfo";
import { JobCard } from "@/components/JobCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchJobs, jobBySlug, similarJobs } from "@/lib/contentstack";
import type { Job } from "@/lib/types";

export const Route = createFileRoute("/jobs/$slug")({
  component: JobDetailPage,
});

const badgeClass = "inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 text-slate-300">{children}</div>
    </section>
  );
}

function JobDetailPage() {
  const { slug } = useParams({ from: "/jobs/$slug" });
  const [job, setJob] = useState<Job | null>(null);
  const [similar, setSimilar] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const jobs = await fetchJobs();
        const found = jobBySlug(jobs, slug);
        if (!found || found.status !== "Open") { setNotFound(true); setLoading(false); return; }
        setJob(found);
        setSimilar(similarJobs(jobs, found.id, found.category.slug));
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-800 mb-4" />
      <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
    </div>
  );

  if (notFound || !job) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-white">Role not found</h1>
      <p className="mt-2 text-slate-400">This role may have been closed or moved.</p>
      <Link to="/jobs" className="mt-6 inline-block text-blue-400 hover:text-blue-300">← Back to Jobs</Link>
    </div>
  );

  return (
    <div>
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <img src={job.company.logo} alt={job.company.name} className="h-16 w-16 rounded-md border border-slate-800 bg-slate-900 object-cover" />
              <div>
                <div className="text-sm text-slate-400">{job.company.name}</div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{job.title}</h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={badgeClass}><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span className={badgeClass}><Clock className="h-3.5 w-3.5" />{job.workType}</span>
                  <span className={badgeClass}><Briefcase className="h-3.5 w-3.5" />{job.employmentType}</span>
                  <span className={badgeClass}><TrendingUp className="h-3.5 w-3.5" />{job.experienceLevel}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <DollarSign className="h-4 w-4 text-blue-400" />{job.salaryText}
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
            <Section title="About the role"><p className="leading-relaxed">{job.aboutTheRole}</p></Section>
            {job.responsibilities.length > 0 && (
              <Section title="Responsibilities">
                <ul className="list-disc space-y-2 pl-5">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
              </Section>
            )}
            {job.requirements.length > 0 && (
              <Section title="Requirements">
                <ul className="list-disc space-y-2 pl-5">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              </Section>
            )}
            {job.preferredQualifications.length > 0 && (
              <Section title="Preferred qualifications">
                <ul className="list-disc space-y-2 pl-5">{job.preferredQualifications.map((r) => <li key={r}>{r}</li>)}</ul>
              </Section>
            )}
            {job.skills.length > 0 && <Section title="Skills"><SkillsList skills={job.skills} /></Section>}
            <div className="pt-4"><ApplyButton /></div>
          </div>
          <aside className="space-y-4"><CompanyInfo company={job.company} /></aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-slate-800 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeader title="Similar roles" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
