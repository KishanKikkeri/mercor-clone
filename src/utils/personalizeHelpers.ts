import { trackEvent } from "@/lib/personalize/tracker";
import { Job } from "@/lib/types";

/**
 * Tracks when a user views the homepage.
 */
export function trackHomepageView() {
  trackEvent("homepage_viewed");
}

/**
 * Tracks when a user completes a search.
 * @param keyword The non-empty query string search term.
 */
export function trackJobSearch(keyword: string) {
  trackEvent("job_search", { searchKeyword: keyword });
}

/**
 * Tracks when a category filter or page is selected.
 * @param categoryName The name of the selected category.
 */
export function trackCategorySelect(categoryName: string) {
  trackEvent("category_selected", { category: categoryName });
}

/**
 * Tracks when a user views a specific job description page.
 * @param job The job details object.
 */
export function trackJobView(job: Job) {
  trackEvent("job_viewed", {
    jobId: job.id,
    title: job.title,
    category: job.category?.name || "Unknown",
    company: job.company?.name || "Unknown",
  });
}

/**
 * Tracks when a user clicks the apply button for a job.
 * @param job The job details object.
 */
export function trackApplyClick(job: Job) {
  trackEvent("apply_clicked", {
    jobId: job.id,
    title: job.title,
    category: job.category?.name || "Unknown",
    company: job.company?.name || "Unknown",
  });
}
