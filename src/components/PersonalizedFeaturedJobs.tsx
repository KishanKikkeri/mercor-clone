"use client";

import { useEffect, useState } from "react";
import { usePersonalize } from "@/hooks/usePersonalize";
import { Job, FeaturedJobsCMS } from "@/lib/types";
import { JobCard } from "./JobCard";
import { SectionHeader } from "./SectionHeader";
import Link from "next/link";
import { getBehaviorState, subscribeToBehavior } from "@/lib/behavior/engine";

interface PersonalizedFeaturedJobsProps {
  fallback: FeaturedJobsCMS | null;
  defaultJobs: Job[];
}

export function PersonalizedFeaturedJobs({ fallback, defaultJobs }: PersonalizedFeaturedJobsProps) {
  const { sdk, loading } = usePersonalize();
  const [featuredData, setFeaturedData] = useState<FeaturedJobsCMS | null>(fallback);
  const [displayJobs, setDisplayJobs] = useState<Job[]>(defaultJobs);
  const [currentPersona, setCurrentPersona] = useState<string | null>(null);

  // Subscribe to behavioral scoring engine to get the current persona reactively
  useEffect(() => {
    const initialState = getBehaviorState();
    setCurrentPersona(initialState.currentPersona ?? null);

    const unsubscribe = subscribeToBehavior((state) => {
      setCurrentPersona(state.currentPersona ?? null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch personalized Featured Jobs when variant aliases are resolved
  useEffect(() => {
    if (loading || !sdk) return;

    const aliases = sdk.getVariantAliases();
    if (aliases && aliases.length > 0) {
      fetch(`/api/personalized-featured-jobs?aliases=${encodeURIComponent(aliases.join(","))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.featuredJobs) {
            setFeaturedData(data.featuredJobs);
            if (data.featuredJobs.jobs && data.featuredJobs.jobs.length > 0) {
              setDisplayJobs(data.featuredJobs.jobs);
            }
          }
        })
        .catch((err) => {
          if (process.env.NODE_ENV === "development") {
            console.error("[Personalize Featured Jobs] Failed to load personalized variant:", err);
          }
        });
    }
  }, [sdk, loading]);

  // Sort display jobs based on the active persona (bringing matching jobs to the top)
  const sortedJobs = [...displayJobs].sort((a, b) => {
    if (!currentPersona) return 0;
    const aMatches = a.category.name === currentPersona;
    const bMatches = b.category.name === currentPersona;
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });

  const featuredTitle = featuredData?.heading || fallback?.heading || "Featured Opportunities";
  const featuredSubtitle = featuredData?.description || fallback?.description || "Hand-picked roles from teams shipping ambitious work.";

  return (
    <section className="border-t border-purple-50 bg-purple-50/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            title={featuredTitle}
            subtitle={featuredSubtitle}
          />
          <Link
            href="/jobs"
            className="hidden shrink-0 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors sm:inline"
          >
            View all jobs →
          </Link>
        </div>
        {sortedJobs.length === 0 ? (
          <div className="mt-10 text-center text-slate-500 py-10">No featured jobs found.</div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedJobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
