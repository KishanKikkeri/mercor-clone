import Personalize from '@contentstack/personalize-edge-sdk';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';

let personalizeInstance: Sdk | null = null;
let isInitializing = false;

/**
 * Singleton client-side loader for Contentstack Personalize SDK.
 * Ensures the SDK is only initialized once in browser environments.
 */
export async function getPersonalizeSdk(): Promise<Sdk | null> {
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

    // Initialize Contentstack Personalize Client
    personalizeInstance = await Personalize.init(projectUid);

    if (process.env.NODE_ENV === 'development') {
      console.log('✓ Contentstack Personalize SDK initialized successfully.');
      console.log('Visitor ID:', personalizeInstance.getUserId());
    }

    return personalizeInstance;
  } catch (error) {
    console.error('Failed to initialize Contentstack Personalize SDK:', error);
    return null;
  } finally {
    isInitializing = false;
  }
}
