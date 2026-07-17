import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "../env";

/**
 * Singleton Prisma Client with pg Driver Adapter (Prisma 7 compatible)
 * 
 * Responsibility:
 * This file instantiates the Prisma Client using the PostgreSQL pg driver adapter.
 * It prevents connection leaks during development (Next.js hot-reloads) by attaching the 
 * instantiated client to the global scope.
 * 
 * Flow:
 * Upper layers (Repository/Services) -> prisma (singleton instance) -> PrismaPg Adapter -> pg.Pool -> Supabase DB
 * 
 * Note:
 * Prisma Client instantiation is server-only. In client-side code bundles, this file safely exports
 * a placeholder to prevent Next.js bundler errors.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we are running in the server environment (API route, server components)
const isServer = typeof window === "undefined";

let prismaInstance: PrismaClient;

if (isServer) {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
  } else {
    // 1. Establish database connection pool configuration using pg
    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
    });

    // 2. Wrap it with the Prisma 7 PostgreSQL driver adapter
    const adapter = new PrismaPg(pool);

    // 3. Initialize Prisma Client with the driver adapter
    prismaInstance = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    // 4. Save to global scope in development to prevent duplicate pools on hot reloads
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} else {
  // Client-side fallback to prevent bundler errors
  prismaInstance = null as unknown as PrismaClient;
}

export const prisma = prismaInstance;
export type { PrismaClient } from "../../generated/prisma/client";
