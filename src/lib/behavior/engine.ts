import { BehaviorState, Interaction, InteractionType } from "./types";
import { loadBehaviorState, saveBehaviorState } from "./storage";
import { updateScore } from "./scoreManager";

let currentState: BehaviorState = loadBehaviorState();
const listeners = new Set<(state: BehaviorState) => void>();

/**
 * Returns the current cached behavior scoring profile state.
 */
export function getBehaviorState(): BehaviorState {
  return currentState;
}

/**
 * Records a user interaction, updates cumulative behavior profile scores, 
 * persists updates to storage, and notifies active hooks.
 */
export function recordBehaviorInteraction(
  type: InteractionType,
  payload?: any
): void {
  if (typeof window === "undefined") return;

  try {
    const interaction: Interaction = { type, payload };
    const nextState = updateScore(currentState, interaction);
    currentState = nextState;
    saveBehaviorState(currentState);

    // Notify subscribed observers
    listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (e) {
        console.error("[Behavior Engine] Error in listener callback:", e);
      }
    });

    // Logging in development mode only
    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[Behavior Engine]`,
        "color: #10b981; font-weight: bold;",
        `\nInteraction: ${type}\nPayload:`,
        payload || {},
        `\n\nUpdated Scores:\n`,
        `AI Engineer:         ${currentState.aiEngineer}\n`,
        `Frontend Developer:  ${currentState.frontendDeveloper}\n`,
        `Backend Developer:   ${currentState.backendDeveloper}\n`,
        `Full Stack Developer: ${currentState.fullStackDeveloper}\n`,
        `Total Interactions:   ${currentState.totalInteractions}\n`,
        `Current Persona:      ${currentState.currentPersona || "None (Below Threshold)"}`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Behavior Engine] Failed to record interaction:", error);
    }
  }
}

/**
 * Subscribes to behavioral profile updates.
 * Returns unsubscribe cleanup method.
 */
export function subscribeToBehavior(
  listener: (state: BehaviorState) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
