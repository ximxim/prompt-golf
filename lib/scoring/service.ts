import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { ChallengeConfig } from "../challenges/types";
import { generateJudgePrompt } from "./judge-prompt";

export interface ScoreResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  dimensions: Record<
    string,
    {
      score: number;
      maxScore: number;
      feedback: string;
    }
  >;
  overallFeedback: {
    whatYouDidWell: string;
    primaryImprovement: string;
    secondaryImprovement?: string;
  };
  promptQualityLevel: "excellent" | "good" | "fair" | "poor";
  timeBonus: number;
  finalScore: number;
}

export class ScoringService {
  /**
   * Score a user's prompt for a challenge
   */
  async scorePrompt(
    userPrompt: string,
    challenge: ChallengeConfig,
    elapsedSeconds?: number
  ): Promise<ScoreResult> {
    const judgePrompt = generateJudgePrompt(challenge);

    // Select model based on challenge config
    const model = this.getModel(challenge.scoring.judge.model);

    const { text } = await generateText({
      model,
      system: judgePrompt,
      prompt: `USER'S PROMPT TO EVALUATE:\n\n${userPrompt}`,
      temperature: challenge.scoring.judge.temperature,
    });

    // Parse JSON response - handle potential markdown wrapping
    let jsonText = text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const rawResult = JSON.parse(jsonText);

    // Calculate time bonus if applicable
    let timeBonus = 0;
    if (
      challenge.scoring.timeBonus?.enabled &&
      elapsedSeconds &&
      elapsedSeconds < challenge.scoring.timeBonus.parTimeSeconds
    ) {
      const bonusPercent = challenge.scoring.timeBonus.maxBonusPercent;
      const parTime = challenge.scoring.timeBonus.parTimeSeconds;
      const timeFactor = 1 - elapsedSeconds / parTime;
      timeBonus = Math.round(
        rawResult.totalScore * (bonusPercent / 100) * timeFactor
      );
    }

    // Build result with dimension max scores
    const dimensions: ScoreResult["dimensions"] = {};
    for (const dim of challenge.scoring.dimensions) {
      dimensions[dim.id] = {
        score: rawResult.dimensions[dim.id]?.score ?? 0,
        maxScore: dim.maxPoints,
        feedback: rawResult.dimensions[dim.id]?.feedback ?? "",
      };
    }

    return {
      totalScore: rawResult.totalScore,
      maxScore: challenge.scoring.maxScore,
      percentage: Math.round(
        (rawResult.totalScore / challenge.scoring.maxScore) * 100
      ),
      dimensions,
      overallFeedback: rawResult.overallFeedback,
      promptQualityLevel: rawResult.promptQualityLevel,
      timeBonus,
      finalScore: rawResult.totalScore + timeBonus,
    };
  }

  /**
   * Get model instance based on config
   */
  private getModel(modelId: string) {
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

  /**
   * Determine quality level from thresholds
   */
  getQualityLevel(
    score: number,
    thresholds: ChallengeConfig["scoring"]["thresholds"]
  ): "excellent" | "good" | "fair" | "poor" {
    if (score >= thresholds.excellent) return "excellent";
    if (score >= thresholds.good) return "good";
    if (score >= thresholds.passing) return "fair";
    return "poor";
  }
}

export const scoringService = new ScoringService();
