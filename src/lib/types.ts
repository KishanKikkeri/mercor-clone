import { Job } from "@/types/job";
export * from "@/types/job";

export interface GlobalSettings {
  logo: string;
  navLinks: { label: string; url: string }[];
  footerDescription: string;
  footerLinks: { label: string; url: string }[];
  socialLinks: { platform: string; url: string }[];
  copyrightText: string;
}

export interface HeroCMS {
  heading: string;
  subheading?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  background_image?: string;
}

export interface FeaturedJobsCMS {
  heading: string;
  description?: string;
  jobs: Job[];
}
