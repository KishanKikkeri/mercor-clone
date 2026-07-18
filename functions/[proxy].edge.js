import Personalize from '@contentstack/personalize-edge-sdk';

// List of file extensions that represent static assets to bypass personalization routing
const staticAssetExtensions = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.json',
  '.txt',
  '.map'
];

/**
 * Helper to determine if a request should bypass the personalization decision engine.
 * Bypasses Next.js internals, static files, and API endpoints.
 */
function shouldBypassPersonalization(url) {
  const pathname = url.pathname;
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    staticAssetExtensions.some(ext => pathname.endsWith(ext))
  );
}

/**
 * Contentstack Launch Edge Proxy handler function.
 */
export default async function handler(request, context) {
  const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;

  // Fallback to normal request processing if Personalize is not configured
  if (!projectUid) {
    return fetch(request);
  }

  const url = new URL(request.url);

  // Bypass asset files to minimize latency and conserve API quota
  if (shouldBypassPersonalization(url)) {
    return fetch(request);
  }

  try {
    const edgeApiUrl = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL || undefined;

    // Initialize the SDK with the incoming request context (provides IP, user agent, cookies, etc.)
    const personalizeSdk = await Personalize.init(projectUid, {
      request,
      edgeApiUrl
    });

    // Extract the resolved variant parameters for the visitor
    const variantParam = personalizeSdk.getVariantParam();
    
    // Inject the variant parameters as a query parameter for Next.js to fetch the right Contentstack variants
    if (variantParam) {
      url.searchParams.set('variants', variantParam);
    }

    // Proxy the request by fetching the destination page (Next.js server)
    const response = await fetch(url.toString(), request);

    // Persist cookies and state (including visitor ID and manifest) back into the client response
    return personalizeSdk.addStateToResponse(response, request);
  } catch (error) {
    // Robust fallback: Log the failure and continue serving the standard CMS page
    console.error('Contentstack Personalize Edge Proxy execution failed:', error);
    return fetch(request);
  }
}
