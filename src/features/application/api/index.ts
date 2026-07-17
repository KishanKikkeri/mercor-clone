/**
 * Application API Layer Exports
 * 
 * Responsibility:
 * This acts as the unified module index for the API Layer of the Application feature.
 * It exports both server-side controllers (API) and client-side helpers (Client) to ensure
 * clean directory-level imports across the application.
 */

// Server-Side API Controllers
export { 
  ApplicationApi, 
  applicationApi 
} from "./application.api";

export type { 
  ApiResponse 
} from "./application.api";

// Client-Side API Clients
export { 
  ApplicationClient, 
  applicationClient 
} from "./application.client";

export type { 
  ApiClientResponse, 
  ApiSuccess, 
  ApiError, 
  SubmitApplicationRequest, 
  GetApplicationsClientFilters 
} from "./application.client";
