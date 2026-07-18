import Personalize from '@contentstack/personalize-edge-sdk';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';

let personalizeInstance: Sdk | null = null;
let isInitializing = false;

/**
 * Singleton client-side loader for Contentstack Personalize SDK.
 * Ensures the SDK is only initialized once in browser environments.
 */
export async function getPersonalizeSdk(attributes?: Record<string, any>): Promise<Sdk | null> {
  // Prevent server-side initialization to avoid cross-request data leaks
  if (typeof window === 'undefined') {
    return null;
  }

  if (personalizeInstance) {
    return personalizeInstance;
  }

  if (isInitializing) {
    // Wait for the in-progress initialization to complete
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return personalizeInstance;
  }

  const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
  if (!projectUid) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Personalization Project UID is missing. Personalization will be disabled.');
    }
    return null;
  }

  isInitializing = true;

  try {
    const edgeApiUrl = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL || undefined;
    
    // Set regional API endpoint before calling init if specified
    if (edgeApiUrl) {
      Personalize.setEdgeApiUrl(edgeApiUrl);
    }

    const initOptions: any = {};
    if (attributes) {
      initOptions.liveAttributes = attributes;
    }

    // Initialize Contentstack Personalize Client
    personalizeInstance = await Personalize.init(projectUid, initOptions);

    if (process.env.NODE_ENV === 'development') {
      console.log('✓ Contentstack Personalize SDK initialized successfully.');
      console.log('Visitor ID:', personalizeInstance.getUserId());
    }

    return personalizeInstance;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const isNetworkError = errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch');
      if (isNetworkError) {
        console.warn('⚠️ Contentstack Personalize Edge API is unreachable (Failed to fetch). Running in offline/fallback mode.');
      } else {
        console.error('Failed to initialize Contentstack Personalize SDK:', error);
      }
    }
    return null;
  } finally {
    isInitializing = false;
  }
}

/**
 * Force-refreshes the personalization SDK manifest.
 * Resets the local singleton cache, clears the client manifest cookie,
 * and fetches the latest computed manifest from Contentstack Personalize Edge.
 */
export async function refreshPersonalizeSdk(attributes?: Record<string, any>): Promise<Sdk | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // Clear cached instance
  personalizeInstance = null;

  // Clear the manifest cookie to force Personalize.init to execute fetchManifest
  try {
    document.cookie = "cs-personalize-manifest=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } catch (cookieErr) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Personalize SDK] Failed to clear manifest cookie:', cookieErr);
    }
  }

  // Re-fetch manifest from edge
  return getPersonalizeSdk(attributes);
}
