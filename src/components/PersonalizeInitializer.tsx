'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

  // Synchronize resolved local persona to Contentstack Personalize Edge custom attributes
  useEffect(() => {
    if (!sdk) return;

    let lastSyncedPersona: string | null | undefined = undefined;

    const syncPersona = (persona: string | null) => {
      if (persona !== lastSyncedPersona) {
        lastSyncedPersona = persona;

        sdk
          .set({ visitor_persona: persona })
          .then(async () => {
            if (process.env.NODE_ENV === "development") {
              console.log(
                `%c[Personalize Sync]`,
                "color: #2563eb; font-weight: bold;",
                `Synced persona attribute: "${persona}". Re-evaluating manifest...`
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
