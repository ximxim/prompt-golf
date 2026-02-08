import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { challengeRegistry } from "@/lib/challenges/registry";
import { generateJudgePrompt } from "@/lib/scoring/judge-prompt";

const ScoreRequestSchema = z.object({
  challengeId: z.string(),
  prompt: z.string().min(1).max(10000),
  elapsedSeconds: z.number().min(0),
});

const ScoreResultSchema = z.object({
  totalScore: z.number(),
  dimensions: z.record(
    z.string(),
    z.object({
      score: z.number(),
      feedback: z.string(),
    })
  ),
  overallFeedback: z.object({
    whatYouDidWell: z.string(),
    primaryImprovement: z.string(),
    secondaryImprovement: z.string().optional(),
  }),
  promptQualityLevel: z.enum(["excellent", "good", "fair", "poor"]),
});

function getModel(modelId: string) {
  switch (modelId) {
    case "claude-sonnet-4-20250514":
      return anthropic("claude-sonnet-4-20250514");
    case "claude-opus-4-20250514":
      return anthropic("claude-opus-4-20250514");
    case "gpt-4o":
      return openai("gpt-4o");
    default:
      return anthropic("claude-sonnet-4-20250514");
  }
}

export async function POST(request: Request) {
  try {
    // Ensure registry is initialized
    await challengeRegistry.initialize();

    // Parse and validate request
    const body = await request.json();
    const { challengeId, prompt, elapsedSeconds } =
      ScoreRequestSchema.parse(body);

    // Load challenge config
    const challenge = challengeRegistry.get(challengeId);
    if (!challenge) {
      return Response.json({ error: "Challenge not found" }, { status: 404 });
    }

    // Generate judge prompt
    const judgePrompt = generateJudgePrompt(challenge);
    const model = getModel(challenge.scoring.judge.model);

    // Stream the scoring result
    const result = streamObject({
      model,
      system: judgePrompt,
      prompt: `USER'S PROMPT TO EVALUATE:\n\n${prompt}`,
      schema: ScoreResultSchema,
      temperature: 0,
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Scoring error:", error);
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
