"use client";

import { useEffect } from "react";
import { trackHomepageView } from "@/utils/personalizeHelpers";

let hasTracked = false;

export function TrackHomepage() {
  useEffect(() => {
    // Once per page load
    if (!hasTracked) {
      hasTracked = true;
      trackHomepageView();
    }
  }, []);

  return null;
}
