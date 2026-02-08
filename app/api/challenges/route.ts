import { NextRequest } from "next/server";
import { challengeRegistry } from "@/lib/challenges/registry";

export async function GET(request: NextRequest) {
  try {
    await challengeRegistry.initialize();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const difficulty = searchParams.get("difficulty")
      ? parseInt(searchParams.get("difficulty")!)
      : undefined;
    const tags = searchParams.get("tags")?.split(",") || undefined;

    const challenges = challengeRegistry.getAll({
      category,
      difficulty,
      tags,
    });

    // Return simplified challenge data for listing (no full scoring config)
    const simplified = challenges.map((c) => ({
      id: c.id,
      version: c.version,
      metadata: c.metadata,
      flags: c.flags,
      content: {
        scenario: {
          headline: c.content.scenario.headline,
          persona: c.content.scenario.persona,
        },
      },
      scoring: {
        maxScore: c.scoring.maxScore,
        thresholds: c.scoring.thresholds,
      },
      progression: c.progression,
    }));

    return Response.json({
      challenges: simplified,
      total: simplified.length,
      categories: challengeRegistry.getCategories(),
    });
  } catch (error) {
    console.error("Failed to load challenges:", error);
    return Response.json(
      { error: "Failed to load challenges" },
      { status: 500 }
    );
  }
}
