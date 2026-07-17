import { z } from "zod";

/**
 * PostgreSQL connection string validator.
 * Ensures the connection URL is not empty and conforms to postgres or postgresql schemas.
 */
const postgresUrlSchema = z.string()
  .min(1, "Database connection string is required")
  .refine(
    (url) => url.startsWith("postgres://") || url.startsWith("postgresql://"),
    {
      message: "Database connection URL must be a valid PostgreSQL connection string starting with 'postgres://' or 'postgresql://'",
    }
  );

/**
 * Client-side environment variables schema.
 * These variables are prefixed with NEXT_PUBLIC_ and are exposed to the browser.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

/**
 * Server-side environment variables schema.
 * These variables are only accessible in server environments (API routes, Server Components, etc.).
 */
const serverEnvSchema = z.object({
  DATABASE_URL: postgresUrlSchema,
  DIRECT_URL: postgresUrlSchema,
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_BUCKET_NAME: z.string().min(1, "AWS_BUCKET_NAME is required"),
  AWS_BUCKET_URL: z.string().url("AWS_BUCKET_URL must be a valid URL"),
});

const isServer = typeof window === "undefined";

// Collect environment variables safely
const clientEnvInput = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const serverEnvInput = isServer
  ? {
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
      AWS_BUCKET_URL: process.env.AWS_BUCKET_URL,
    }
  : {};

let parsedEnv: Record<string, any> = {};

if (isServer) {
  const mergedSchema = clientEnvSchema.merge(serverEnvSchema);
  const result = mergedSchema.safeParse({ ...clientEnvInput, ...serverEnvInput });
  if (!result.success) {
    const formattedError = result.error.format();
    console.error("❌ Environment validation failed:", JSON.stringify(formattedError, null, 2));
    throw new Error(
      `[Startup Error] Missing or misconfigured environment variables. Please check your config:\n` +
      Object.entries(formattedError)
        .filter(([key]) => key !== "_errors")
        .map(([key, value]: [string, any]) => ` - ${key}: ${value._errors?.join(", ")}`)
        .join("\n")
    );
  }
  parsedEnv = result.data;
} else {
  const result = clientEnvSchema.safeParse(clientEnvInput);
  if (!result.success) {
    const formattedError = result.error.format();
    console.error("❌ Client environment validation failed:", JSON.stringify(formattedError, null, 2));
    throw new Error(
      `[Client Error] Missing or misconfigured client-side environment variables:\n` +
      Object.entries(formattedError)
        .filter(([key]) => key !== "_errors")
        .map(([key, value]: [string, any]) => ` - ${key}: ${value._errors?.join(", ")}`)
        .join("\n")
    );
  }
  parsedEnv = result.data;
}

// Export parsed env with appropriate types depending on environment
export const env = parsedEnv as z.infer<typeof clientEnvSchema> &
  Partial<z.infer<typeof serverEnvSchema>>;
