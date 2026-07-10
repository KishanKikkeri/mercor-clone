import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z
    .string()
    .min(1, "This field is required.")
    .min(3, "Full name must be at least 3 characters."),
  email: z.string().min(1, "This field is required.").email("Invalid email address."),
  phone: z
    .string()
    .min(1, "This field is required.")
    .min(10, "Phone number must be at least 10 digits."),
  linkedinUrl: z.string().url("Please enter a valid URL.").or(z.literal("")).optional(),
  portfolioUrl: z.string().url("Please enter a valid URL.").or(z.literal("")).optional(),
  coverLetter: z
    .string()
    .max(1000, "Cover letter cannot exceed 1000 characters.")
    .or(z.literal(""))
    .optional(),
  resume: z.any().optional(),
});
