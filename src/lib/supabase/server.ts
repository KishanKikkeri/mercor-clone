import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

/**
 * Supabase Server-Side Client Utilities
 * 
 * Responsibility:
 * This file provides builders and wrappers for the Supabase client inside server-side environments 
 * (API Routes, Server Components, Server Actions).
 * 
 * It supports:
 * 1. Admin/Service client: Bypasses Row Level Security (RLS) to run migration/system-level tasks.
 * 2. Authenticated client: Dynamically configured with the client request's access token/JWT.
 * 
 * TODO:
 * - Implement request cookie extraction if we shift to session cookie authentication.
 * - Establish logging middleware for database errors and queries executed by the server client.
 */

/**
 * Creates a server-side Supabase client with administrative privileges.
 * WARNING: This client bypasses RLS policies. Use only in secure, server-only operations.
 */
export const createSupabaseAdminClient = () => {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to instantiate the Admin Client.");
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};

/**
 * Creates a server-side Supabase client authenticated on behalf of a specific user.
 * Pass the authorization bearer token extracted from the request headers.
 */
export const createSupabaseUserClient = (accessToken: string) => {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};
