import { getBehaviorState } from "@/lib/behavior/engine";

/**
 * Exposes a helper to fetch the dominant category interest directly.
 */
export function getDominantCategory(): string | null {
  const state = getBehaviorState();
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

  return dominantCategory;
}

/**
 * Exposes a helper to fetch the current resolved persona directly.
 */
export function getCurrentPersona(): string | null {
  return getBehaviorState().currentPersona ?? null;
}
