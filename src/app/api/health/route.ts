import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma/client";

/**
 * Database Connectivity Health Check API
 * 
 * Responsibility:
 * This endpoint verifies that Next.js can establish a successful connection to Supabase PostgreSQL
 * using the Prisma ORM and the pg driver adapter. It performs a lightweight, non-mutating
 * raw query (SELECT 1) to confirm connectivity.
 * 
 * Endpoint:
 * GET /api/health
 */
export async function GET() {
  try {
    // 1. Run a lightweight query to test the active database connection
    // We execute SELECT 1 to ensure that the driver adapter can perform read queries.
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    console.log("✅ Database health check passed:", result);

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      details: result
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Database health check failed:", error);
    
    return NextResponse.json({
      status: "unhealthy",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      error: error.message || "Could not connect to database"
    }, { status: 500 });
  }
}
