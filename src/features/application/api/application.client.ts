import type { Application as ApplicationDb, ApplicationStatus } from "../../../generated/prisma/client";

/**
 * Reusable Client-Side API Success Structure
 */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Reusable Client-Side API Error Structure
 */
export interface ApiError {
  success: false;
  message: string;
  error?: {
    code?: string;
    details?: any;
  };
}

/**
 * Combined API Response type
 */
export type ApiClientResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Request payload for submitting a job application from the frontend UI
 */
export interface SubmitApplicationRequest {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeBase64: string; // Base64 representation for files submission
  resumeFileName: string;
  coverLetter?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

/**
 * Request filters for fetching applications list
 */
export interface GetApplicationsClientFilters {
  jobId?: string;
  email?: string;
  status?: ApplicationStatus;
}

/**
 * ApplicationClient Class
 * 
 * Responsibility:
 * This acts as the single gateway for all frontend HTTP requests related to applications.
 * It serializes outgoing payloads, deserializes JSON responses, handles network/HTTP errors,
 * and formats returns into standardized types.
 * 
 * React components must import this class to interact with the API layer.
 */
export class ApplicationClient {
  private readonly baseUrl = "/api/applications";

  /**
   * Helper request utility.
   * Handles timeouts, network failures, invalid JSON formats, and maps responses to ApiSuccess/ApiError.
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiClientResponse<T>> {
    try {
      // 1. Prepare base request headers (future-ready for token authorization)
      const headers = new Headers(options.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      // TODO: [Future Authentication] Extract auth tokens from global state/local storage and attach
      // headers.set("Authorization", `Bearer ${extractTokenFromSession()}`);

      // TODO: [Future Telemetry] Add client metadata / tracking metrics
      // headers.set("X-Correlation-ID", generateUuid());
      // headers.set("X-Client-Version", "1.0.0");

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000); // 15s timeout limit

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(id);

      // 2. Parse response JSON safely
      let jsonResult: any;
      try {
        jsonResult = await response.json();
      } catch (parseError) {
        return {
          success: false,
          message: `Failed to parse response payload: ${response.statusText}`,
          error: { code: "INVALID_JSON_RESPONSE", details: parseError },
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: jsonResult.message || `Request failed with status code ${response.status}`,
          error: jsonResult.error || { code: `HTTP_STATUS_${response.status}` },
        };
      }

      return {
        success: true,
        message: jsonResult.message || "Request completed successfully.",
        data: jsonResult.data,
      };

    } catch (networkError: any) {
      // TODO: Replace with production logging
      console.error("[API Client Network Error] Request failed:", networkError);
      
      if (networkError.name === "AbortError") {
        return {
          success: false,
          message: "Request timed out after 15 seconds.",
          error: { code: "REQUEST_TIMEOUT" },
        };
      }

      return {
        success: false,
        message: networkError.message || "A network connectivity issue occurred.",
        error: { code: "NETWORK_FAILURE", details: networkError },
      };
    }
  }

  /**
   * Submits a candidate's job application from the frontend form.
   * 
   * Endpoint: POST /api/applications
   */
  async submitApplication(input: SubmitApplicationRequest): Promise<ApiClientResponse<ApplicationDb>> {
    // TODO: [Future Resume Upload Client hook] Before POSTing details, upload raw File to S3 bucket directly.
    // e.g. const s3Result = await s3UploadHelper(file);
    // input.resumeUrl = s3Result.Location;

    return this.request<ApplicationDb>(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  /**
   * Retrieves application details by ID from the API.
   * 
   * Endpoint: GET /api/applications?id={id}
   */
  async getApplication(id: string): Promise<ApiClientResponse<ApplicationDb>> {
    return this.request<ApplicationDb>(`${this.baseUrl}?id=${id}`, {
      method: "GET",
    });
  }

  /**
   * Queries list of applications matching optional parameters.
   * 
   * Endpoint: GET /api/applications
   */
  async getApplications(filters: GetApplicationsClientFilters = {}): Promise<ApiClientResponse<ApplicationDb[]>> {
    // Compile search queries
    const params = new URLSearchParams();
    if (filters.jobId) params.append("jobId", filters.jobId);
    if (filters.email) params.append("email", filters.email);
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    const targetUrl = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return this.request<ApplicationDb[]>(targetUrl, {
      method: "GET",
    });
  }

  /**
   * Transition application status in database.
   * 
   * Endpoint: PATCH /api/applications?id={id}
   */
  async changeApplicationStatus(id: string, status: ApplicationStatus): Promise<ApiClientResponse<ApplicationDb>> {
    // TODO: [Future Timeline Client hook] Track changes in recruiter dashboards

    return this.request<ApplicationDb>(`${this.baseUrl}?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export const applicationClient = new ApplicationClient();
