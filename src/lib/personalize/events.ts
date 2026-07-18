export interface HomepageViewedPayload {}

export interface JobSearchPayload {
  searchKeyword: string;
}

export interface CategorySelectedPayload {
  category: string;
}

export interface JobViewedPayload {
  jobId: string;
  title: string;
  category: string;
  company: string;
}

export interface ApplyClickedPayload {
  jobId: string;
  title: string;
  category: string;
  company: string;
}

export type EventPayloads = {
  homepage_viewed: HomepageViewedPayload;
  job_search: JobSearchPayload;
  category_selected: CategorySelectedPayload;
  job_viewed: JobViewedPayload;
  apply_clicked: ApplyClickedPayload;
};
