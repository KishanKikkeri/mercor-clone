"use client";

import { useEffect, useRef } from "react";
import { trackJobView } from "@/utils/personalizeHelpers";
import { Job } from "@/lib/types";

interface TrackJobViewProps {
  job: Job;
}

export function TrackJobView({ job }: TrackJobViewProps) {
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Once per job page visit, prevents duplicate triggering (e.g. React StrictMode)
    if (job.id && trackedRef.current !== job.id) {
      trackedRef.current = job.id;
      trackJobView(job);
    }
  }, [job]);

  return null;
}
