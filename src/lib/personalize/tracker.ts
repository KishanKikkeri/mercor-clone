import { getPersonalizeSdk } from "../personalize";
import { PersonalizeEventKey } from "./constants";
import { EventPayloads } from "./events";

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
      await sdk.set(payload);
    }

    // Trigger the event
    await sdk.triggerEvent(eventKey);

    if (process.env.NODE_ENV === "development") {
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
