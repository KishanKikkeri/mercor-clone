"use client";

import { useState, useEffect } from "react";
import { BehaviorState } from "@/lib/behavior/types";
import { getBehaviorState, subscribeToBehavior } from "@/lib/behavior/engine";

/**
 * React hook to consume and subscribe to the behavior profile state.
 * Returns the state and resolves the dominant category interest.
 */
export function useBehavior() {
  const [state, setState] = useState<BehaviorState>(() => getBehaviorState());

  useEffect(() => {
    // Sync initially when mounted in the client context
    setState(getBehaviorState());

    // Subscribe to state updates
    const unsubscribe = subscribeToBehavior((nextState) => {
      setState(nextState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Resolves the user's current dominant interest based on cumulative scoring.
   */
  const getDominantInterest = () => {
    const scores = {
      "AI Engineer": state.aiEngineer,
      "Frontend Developer": state.frontendDeveloper,
      "Backend Developer": state.backendDeveloper,
      "Full Stack Developer": state.fullStackDeveloper,
    };

    let dominantCategory: string | null = null;
    let maxScore = 0;

    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantCategory = category;
      }
    }

    return {
      category: dominantCategory,
      score: maxScore,
    };
  };

  return {
    state,
    dominantInterest: getDominantInterest(),
  };
}
