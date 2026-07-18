import { NextResponse } from "next/server";
import { getFeaturedJobs } from "@/lib/contentstack";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const aliasesParam = searchParams.get("aliases");
  const aliases = aliasesParam ? aliasesParam.split(",") : undefined;

  try {
    const featuredJobs = await getFeaturedJobs(aliases);
    return NextResponse.json({ featuredJobs });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Personalized Featured Jobs] Error fetching personalized featured jobs:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch personalized featured jobs" },
      { status: 500 }
    );
  }
}
