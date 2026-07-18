'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';
import { getPersonalizeSdk, refreshPersonalizeSdk } from '@/lib/personalize';
import { getBehaviorState, subscribeToBehavior } from '@/lib/behavior/engine';

interface PersonalizeContextType {
  sdk: Sdk | null;
  loading: boolean;
}

export const PersonalizeContext = createContext<PersonalizeContextType>({
  sdk: null,
  loading: true,
});

/**
 * PersonalizeProvider Context Wrapper.
 * Mounts the Personalize SDK client instance once globally and shares it down the component tree.
 */
export function PersonalizeProvider({ children }: { children: React.ReactNode }) {
  const [sdk, setSdk] = useState<Sdk | null>(null);
  const [loading, setLoading] = useState(true);
  const lastLoggedPersonaRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const instance = await getPersonalizeSdk();
        if (active) {
          setSdk(instance);
        }
      } catch (error) {
        console.error('Failed to resolve personalization context:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sdk) return;

    const syncPersona = (persona: string | null) => {
      if (persona !== lastLoggedPersonaRef.current) {
        const previousPersona = lastLoggedPersonaRef.current;
        lastLoggedPersonaRef.current = persona;

        sdk
          .set({ visitor_persona: persona })
          .then(async () => {
            if (process.env.NODE_ENV === "development") {
              console.log(
                `%c🔄 Persona Sync\n\n` +
                `Previous Persona:\n` +
                `${previousPersona !== undefined ? (previousPersona || "None") : "None"}\n\n` +
                `New Persona:\n` +
                `${persona || "None"}\n\n` +
                `Status:\n` +
                `✓ Synced to Contentstack Personalize\n\n` +
                `-----------------------------------------------------------`,
                "color: #2563eb;"
              );
            }

            // Force refresh of the Personalize SDK manifest to pull newly computed experiences
            const refreshedSdk = await refreshPersonalizeSdk();
            if (refreshedSdk) {
              setSdk(refreshedSdk);
            }
          })
          .catch((error) => {
            if (process.env.NODE_ENV === "development") {
              console.error("[Personalize Sync] Failed to synchronize persona:", error);
            }
          });
      }
    };

    // Synchronize initial persona on mount
    const initialState = getBehaviorState();
    syncPersona(initialState.currentPersona ?? null);

    // Subscribe to score updates to sync future updates
    const unsubscribe = subscribeToBehavior((state) => {
      syncPersona(state.currentPersona ?? null);
    });

    return () => {
      unsubscribe();
    };
  }, [sdk]);

  return (
    <PersonalizeContext.Provider value={{ sdk, loading }}>
      {children}
    </PersonalizeContext.Provider>
  );
}

/**
 * React hook to consume personalization SDK context inside React Client Components.
 */
export function usePersonalizeContext() {
  return useContext(PersonalizeContext);
}
