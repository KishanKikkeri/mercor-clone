"use client";

import { useCallback } from "react";
import { trackEvent } from "@/lib/personalize/tracker";
import { PersonalizeEventKey } from "@/lib/personalize/constants";
import { EventPayloads } from "@/lib/personalize/events";

/**
 * Reusable React Hook to track events from Client Components.
 */
export function useTrackEvent() {
  const track = useCallback(
    <K extends PersonalizeEventKey>(eventKey: K, payload?: EventPayloads[K]) => {
      trackEvent(eventKey, payload);
    },
    []
  );

  return track;
}
