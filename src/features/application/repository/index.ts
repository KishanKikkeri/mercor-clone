/**
 * Application Repository Exports
 * 
 * Responsibility:
 * This acts as the unified module index for the Repository Layer of the Application feature.
 * By exporting classes, interfaces, and singletons from here, upper layers (e.g., Service Layer)
 * only need to import from the directory level, hiding directory structures.
 */

export { 
  ApplicationRepository, 
  applicationRepository, 
  ApplicationRepositoryError, 
  ApplicationNotFoundError 
} from "./application.repository";

export type { 
  CreateApplicationInput, 
  GetApplicationsFilters 
} from "./application.repository";
