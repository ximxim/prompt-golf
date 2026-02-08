import { NextRequest } from "next/server";
import { challengeLoader } from "@/lib/challenges/loader";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { yamlContent, validateOnly } = body;

    if (!yamlContent) {
      return Response.json(
        { error: "Missing yamlContent" },
        { status: 400 }
      );
    }

    try {
      const challenge = challengeLoader.parseChallenge(yamlContent);

      if (!challengeLoader.validateScoring(challenge)) {
        return Response.json(
          {
            valid: false,
            error: "Scoring dimension weights must sum to 100",
          },
          { status: 400 }
        );
      }

      if (validateOnly) {
        return Response.json({
          valid: true,
          challenge: {
            id: challenge.id,
            title: challenge.metadata.title,
            category: challenge.metadata.category,
            difficulty: challenge.metadata.difficulty,
          },
        });
      }

      // In production, this would save to Supabase Storage
      return Response.json({
        valid: true,
        message:
          "Challenge validated successfully. Save to Supabase Storage to deploy.",
        challenge: {
          id: challenge.id,
          title: challenge.metadata.title,
        },
      });
    } catch (parseError) {
      return Response.json(
        {
          valid: false,
          error:
            parseError instanceof Error
              ? parseError.message
              : "Invalid YAML configuration",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
