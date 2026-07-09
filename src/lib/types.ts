export interface Category {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  icon: string;
  featured: boolean;
  jobCount: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  industry: string;
  website: string;
  headquarters: string;
}

export type WorkType = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type ExperienceLevel = "Entry Level" | "Mid Level" | "Senior Level" | "Lead";
export type JobStatus = "Open" | "Closed" | "Draft";

export interface Job {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  company: Company;
  category: Category;
  location: string;
  workType: WorkType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryText: string;
  skills: string[];
  aboutTheRole: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  status: JobStatus;
  featured: boolean;
}

export interface GlobalSettings {
  logo: string;
  navLinks: { label: string; url: string }[];
  footerDescription: string;
  footerLinks: { label: string; url: string }[];
  socialLinks: { platform: string; url: string }[];
  copyrightText: string;
}
