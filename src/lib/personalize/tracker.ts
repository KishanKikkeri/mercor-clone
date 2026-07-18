import { getPersonalizeSdk } from "../personalize";
import { PersonalizeEventKey } from "./constants";
import { EventPayloads } from "./events";
import { recordBehaviorInteraction } from "@/lib/behavior/engine";
import { DEBUG } from "../debug";

/**
 * Triggers an event on Contentstack Personalize.
 * Sets the associated payload attributes first if available.
 * Catches errors gracefully and prevents breaking application flow.
 */
export async function trackEvent<K extends PersonalizeEventKey>(
  eventKey: K,
  payload?: EventPayloads[K]
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  // Record interaction in our local behavioral scoring engine
  try {
    recordBehaviorInteraction(eventKey, payload);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Behavior Engine] Failed to record interaction:", error);
    }
  }

  try {
    const sdk = await getPersonalizeSdk();
    if (!sdk) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Personalize] SDK not initialized. Skipping event: ${eventKey}`);
      }
      return;
    }

    // Pass custom attributes to SDK context if properties are provided
    if (payload && Object.keys(payload).length > 0) {
      const cleanPayload = Object.entries(payload).reduce((acc, [key, val]) => {
        acc[key] = val === null ? "" : val;
        return acc;
      }, {} as any);
      await sdk.set(cleanPayload);
    }

    // Trigger the event
    await sdk.triggerEvent(eventKey);

    if (DEBUG.enabled && DEBUG.events) {
      console.log(
        `%c[Personalize]`,
        "color: #9333ea; font-weight: bold;",
        `\nEvent:\n${eventKey}\n\nPayload:\n`,
        payload || {}
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[Personalize] Error tracking event "${eventKey}":`, error);
    }
  }
}
