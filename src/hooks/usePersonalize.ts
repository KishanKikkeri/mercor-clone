'use client';

import { usePersonalizeContext } from '@/components/PersonalizeInitializer';

/**
 * Reusable client-side React Hook to consume Contentstack Personalize SDK instance.
 * 
 * @returns {sdk, loading} object where sdk is the initialized Sdk instance (or null) and loading is initialization state.
 * 
 * @example
 * ```tsx
 * const { sdk, loading } = usePersonalize();
 * 
 * useEffect(() => {
 *   if (sdk) {
 *     sdk.triggerEvent('view_page');
 *   }
 * }, [sdk]);
 * ```
 */
export function usePersonalize() {
  return usePersonalizeContext();
}
