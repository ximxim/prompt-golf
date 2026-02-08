"use client";

import { useState, useCallback } from "react";

export interface ScoreResultType {
  totalScore: number;
  dimensions: Record<
    string,
    {
      score: number;
      feedback: string;
    }
  >;
  overallFeedback: {
    whatYouDidWell: string;
    primaryImprovement: string;
    secondaryImprovement?: string;
  };
  promptQualityLevel: "excellent" | "good" | "fair" | "poor";
}

export interface ScoringState {
  score: ScoreResultType | null;
  partialScore: ScoreResultType | undefined;
  isScoring: boolean;
  error: string | null;
  timeBonus: number;
  finalScore: number;
}

export function useScoring(challengeId: string) {
  const [score, setScore] = useState<ScoreResultType | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeBonus, setTimeBonus] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const submitForScoring = useCallback(
    async (prompt: string, elapsedSeconds: number) => {
      setIsScoring(true);
      setError(null);
      setScore(null);

      try {
        const response = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeId,
            prompt,
            elapsedSeconds,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Scoring failed");
        }

        // Read streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }

        // Parse the final accumulated text as JSON
        // The stream object response may contain multiple partial JSON objects
        // We need to find the last complete one
        try {
          const result = JSON.parse(fullText);
          setScore(result);
          setFinalScore(result.totalScore + (timeBonus || 0));
        } catch {
          // Try to extract from streaming format
          const lines = fullText.split("\n").filter((l) => l.trim());
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              const parsed = JSON.parse(lines[i]);
              if (parsed.totalScore !== undefined) {
                setScore(parsed);
                setFinalScore(parsed.totalScore + (timeBonus || 0));
                break;
              }
            } catch {
              continue;
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scoring failed");
      } finally {
        setIsScoring(false);
      }
    },
    [challengeId, timeBonus]
  );

  const reset = useCallback(() => {
    setScore(null);
    setIsScoring(false);
    setError(null);
    setTimeBonus(0);
    setFinalScore(0);
  }, []);

  return {
    score,
    isScoring,
    error,
    timeBonus,
    finalScore,
    submitForScoring,
    reset,
  };
}
