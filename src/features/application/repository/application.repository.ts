import { prisma } from "../../../lib/prisma/client";
import { Application, ApplicationStatus, Prisma } from "../../../generated/prisma/client";

/**
 * Domain Exception: ApplicationRepositoryError
 * Base error representing any database failure inside the Application repository layer.
 */
export class ApplicationRepositoryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ApplicationRepositoryError";
  }
}

/**
 * Domain Exception: ApplicationNotFoundError
 * Triggered specifically when an Application query targeting a primary key returns null.
 */
export class ApplicationNotFoundError extends ApplicationRepositoryError {
  constructor(id: string) {
    super(`Application with ID ${id} was not found in the database.`);
    this.name = "ApplicationNotFoundError";
  }
}

/**
 * Interface definition for Application creation input parameters.
 * Isolates upper layers from direct dependencies on Prisma input schema structures.
 */
export interface CreateApplicationInput {
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  status?: ApplicationStatus;
}

/**
 * Interface definition for Application listing query filters.
 */
export interface GetApplicationsFilters {
  jobId?: string;
  email?: string;
  status?: ApplicationStatus;
  skip?: number;
  take?: number;
}

/**
 * ApplicationRepository Class
 * 
 * Responsibility:
 * This class encapsulates all database access operations for the Application model.
 * It uses the Prisma Client singleton wrapped in pg driver adapter for queries, mapping any database-specific
 * exceptions to clean, domain-specific errors.
 * 
 * It contains zero business validation or routing rules.
 */
export class ApplicationRepository {
  /**
   * Persists a new job application record.
   * 
   * Input: CreateApplicationInput fields.
   * Output: Persisted Application object with DB defaults.
   */
  async createApplication(data: CreateApplicationInput): Promise<Application> {
    try {
      // TODO: Replace with production logging
      console.log(`[Repository] Creating application for email: ${data.email}, Job: ${data.jobId}`);
      
      return await prisma.application.create({
        data: {
          jobId: data.jobId,
          jobTitle: data.jobTitle,
          companyName: data.companyName,
          candidateName: data.candidateName,
          email: data.email,
          phone: data.phone,
          linkedinUrl: data.linkedinUrl ?? null,
          portfolioUrl: data.portfolioUrl ?? null,
          coverLetter: data.coverLetter ?? null,
          resumeUrl: data.resumeUrl ?? null,
          status: data.status ?? ApplicationStatus.APPLIED,
        },
      });
    } catch (error) {
      // TODO: Replace with production logging
      console.error("[Repository Error] createApplication failed:", error);
      throw new ApplicationRepositoryError("Failed to persist job application to database.", error);
    }
  }

  /**
   * Retrieves a single job application using its unique UUID.
   * 
   * Input: application uuid.
   * Output: Application object.
   * Throws: ApplicationNotFoundError if record is missing.
   */
  async getApplicationById(id: string): Promise<Application> {
    try {
      // TODO: Replace with production logging
      console.log(`[Repository] Fetching application by ID: ${id}`);
      
      const record = await prisma.application.findUnique({
        where: { id },
      });

      if (!record) {
        throw new ApplicationNotFoundError(id);
      }

      return record;
    } catch (error) {
      if (error instanceof ApplicationNotFoundError) {
        throw error;
      }
      // TODO: Replace with production logging
      console.error(`[Repository Error] getApplicationById failed for ID ${id}:`, error);
      throw new ApplicationRepositoryError(`Failed to fetch application record for ID: ${id}.`, error);
    }
  }

  /**
   * Queries and returns lists of application records using optional filter parameters.
   * 
   * Input: GetApplicationsFilters (jobId, email, status, pagination skip/take settings).
   * Output: Array of Application objects matching criteria.
   */
  async getApplications(filters: GetApplicationsFilters = {}): Promise<Application[]> {
    try {
      // TODO: Replace with production logging
      console.log("[Repository] Fetching applications list with filters:", JSON.stringify(filters));
      
      const { jobId, email, status, skip, take } = filters;
      
      const whereClause: Prisma.ApplicationWhereInput = {};
      if (jobId) whereClause.jobId = jobId;
      if (email) whereClause.email = email;
      if (status) whereClause.status = status;

      return await prisma.application.findMany({
        where: whereClause,
        skip: skip ?? undefined,
        take: take ?? undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      // TODO: Replace with production logging
      console.error("[Repository Error] getApplications failed:", error);
      throw new ApplicationRepositoryError("Failed to fetch applications from database.", error);
    }
  }

  /**
   * Updates the workflow status of an application.
   * 
   * Input: application uuid, new status enum value.
   * Output: Updated Application object.
   */
  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application> {
    try {
      // TODO: Replace with production logging
      console.log(`[Repository] Updating status for application ${id} to: ${status}`);

      return await prisma.application.update({
        where: { id },
        data: { status },
      });
    } catch (error: any) {
      // Catch Prisma record-not-found codes specifically
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new ApplicationNotFoundError(id);
      }
      // TODO: Replace with production logging
      console.error(`[Repository Error] updateApplicationStatus failed for ID ${id}:`, error);
      throw new ApplicationRepositoryError(`Failed to update application status for ID: ${id}.`, error);
    }
  }

  /**
   * Delete application placeholder.
   * Soft deletes or purges are not required in this story.
   * 
   * Input: application uuid.
   */
  async deleteApplication(id: string): Promise<void> {
    // TODO: Replace with production logging
    console.warn(`[Repository Placeholder] deleteApplication called for ID: ${id}. Operation not implemented yet.`);
    throw new ApplicationRepositoryError(`Delete operation is not supported yet. Tried deleting ID: ${id}.`);
  }
}

export const applicationRepository = new ApplicationRepository();
