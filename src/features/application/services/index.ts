/**
 * Application Services Exports
 * 
 * Responsibility:
 * This serves as the unified module index for the Service/Business Layer of the Application feature.
 * By exporting classes, interfaces, and singletons from here, upper layers (e.g. API Route handlers)
 * can import items directly from the folder namespace.
 */

export { 
  ApplicationService, 
  applicationService 
} from "./application.service";

export type { 
  ServiceResult, 
  SubmitApplicationInput 
} from "./application.service";
