'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';
import { getPersonalizeSdk } from '@/lib/personalize';

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
