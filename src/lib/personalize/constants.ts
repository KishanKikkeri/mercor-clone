export const PERSONALIZE_EVENTS = {
  HOMEPAGE_VIEWED: "homepage_viewed",
  JOB_SEARCH: "job_search",
  CATEGORY_SELECTED: "category_selected",
  JOB_VIEWED: "job_viewed",
  APPLY_CLICKED: "apply_clicked",
} as const;

export type PersonalizeEventKey = typeof PERSONALIZE_EVENTS[keyof typeof PERSONALIZE_EVENTS];
