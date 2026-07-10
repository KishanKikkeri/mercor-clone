export * from "@/types/job";

export interface GlobalSettings {
  logo: string;
  navLinks: { label: string; url: string }[];
  footerDescription: string;
  footerLinks: { label: string; url: string }[];
  socialLinks: { platform: string; url: string }[];
  copyrightText: string;
}
