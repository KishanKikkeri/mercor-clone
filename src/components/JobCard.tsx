import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      to="/jobs/$slug"
      params={{ slug: job.slug }}
      className="group flex h-full flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-6 transition-all hover:border-blue-500/40 hover:bg-slate-900 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
    >
      <div className="flex items-start gap-3">
        <img
          src={job.company.logo}
          alt=""
          className="h-10 w-10 rounded-md border border-slate-800 bg-slate-900 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-white group-hover:text-blue-400">
            {job.title}
          </h3>
          <p className="truncate text-sm text-slate-400">{job.company.name}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-slate-300">{job.shortDescription}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-200">
          {job.workType}
        </span>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-200">
          {job.employmentType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400"
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}
