import { NextResponse } from "next/server";
import { getHero } from "@/lib/contentstack";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const aliasesParam = searchParams.get("aliases");
  const aliases = aliasesParam ? aliasesParam.split(",") : undefined;

  try {
    const hero = await getHero(aliases);
    return NextResponse.json({ hero });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Personalized Hero] Error fetching personalized hero:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch personalized hero" },
      { status: 500 }
    );
  }
}
