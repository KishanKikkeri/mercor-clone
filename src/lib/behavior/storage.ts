import { BehaviorState } from "./types";

const STORAGE_KEY = "bloom_behavior_profile";

export const initialBehaviorState: BehaviorState = {
  aiEngineer: 0,
  frontendDeveloper: 0,
  backendDeveloper: 0,
  fullStackDeveloper: 0,
  totalInteractions: 0,
};

/**
 * Loads behavior state from localStorage, falling back safely to initial state on error/corruption.
 */
export function loadBehaviorState(): BehaviorState {
  if (typeof window === "undefined") {
    return initialBehaviorState;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBehaviorState;

    const parsed = JSON.parse(raw);
    if (isValidState(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error("[Behavior Engine] Failed to load state from localStorage, resetting.", e);
  }
  return initialBehaviorState;
}

/**
 * Saves behavior state to localStorage.
 */
export function saveBehaviorState(state: BehaviorState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("[Behavior Engine] Failed to save state to localStorage", e);
  }
}

/**
 * Resets behavior profile storage state.
 */
export function resetBehaviorState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if the stored object matches the BehaviorState structure
 */
function isValidState(obj: any): obj is BehaviorState {
  return (
    obj &&
    typeof obj.aiEngineer === "number" &&
    typeof obj.frontendDeveloper === "number" &&
    typeof obj.backendDeveloper === "number" &&
    typeof obj.fullStackDeveloper === "number" &&
    typeof obj.totalInteractions === "number"
  );
}
