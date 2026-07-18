"use client";

import { useEffect, useRef } from "react";
import { trackCategorySelect } from "@/utils/personalizeHelpers";
import { Category } from "@/lib/types";

interface TrackCategoryViewProps {
  category: Category;
}

export function TrackCategoryView({ category }: TrackCategoryViewProps) {
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Once per category page visit, prevents duplicate triggering
    if (category.slug && trackedRef.current !== category.slug) {
      trackedRef.current = category.slug;
      trackCategorySelect(category.name);
    }
  }, [category]);

  return null;
}
