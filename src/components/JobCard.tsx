"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group flex h-full flex-col rounded-xl border border-purple-100 bg-white p-6 shadow-sm card-hover-effect"
    >
      <div className="flex items-start gap-3">
        <img
          src={job.company.logo}
          alt={job.company.name}
          className="h-10 w-10 rounded-lg border border-purple-50 bg-slate-50 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
            {job.title}
          </h3>
          <p className="truncate text-sm text-slate-500 font-medium">{job.company.name}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-slate-600 leading-relaxed">{job.shortDescription}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
          <MapPin className="h-3.5 w-3.5 text-purple-500" />
          {job.location}
        </span>
        <span className="rounded-full border border-purple-50 bg-purple-50/40 px-2.5 py-0.5 font-medium text-purple-700">
          {job.workType}
        </span>
        <span className="rounded-full border border-purple-50 bg-purple-50/40 px-2.5 py-0.5 font-medium text-purple-700">
          {job.employmentType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600"
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}
