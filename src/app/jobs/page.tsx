import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { JobsClient } from "./JobsClient";
import { fetchCategories, fetchJobs, openJobs } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Explore Jobs — TalentBloom",
  description: "Browse open roles across tech and creative disciplines on TalentBloom.",
};

export const revalidate = 60; // Cache page for up to 60 seconds

export default async function JobsPage() {
  const [categories, allJobs] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchJobs().catch(() => []),
  ]);

  const activeJobs = openJobs(allJobs);

  return (
    <div>
      <PageHero 
        eyebrow="Open Roles" 
        title="Browse every opportunity." 
        subtitle="Filter across categories, work types, and experience levels to find your fit." 
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <JobsClient initialJobs={activeJobs} categories={categories} />
      </section>
    </div>
  );
}
