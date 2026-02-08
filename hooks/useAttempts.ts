"use client";

import { useState, useEffect, useCallback } from "react";

export interface Attempt {
  id: string;
  challengeId: string;
  prompt: string;
  totalScore: number;
  maxScore: number;
  finalScore: number;
  timeBonus: number;
  elapsedSeconds: number;
  qualityLevel: "excellent" | "good" | "fair" | "poor";
  dimensions: Record<
    string,
    { score: number; maxScore: number; feedback: string }
  >;
  overallFeedback: {
    whatYouDidWell: string;
    primaryImprovement: string;
    secondaryImprovement?: string;
  };
  createdAt: string;
}

const STORAGE_KEY = "prompt-golf-attempts";

function getStoredAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAttempts(attempts: Attempt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function useAttempts(challengeId?: string) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load attempts from localStorage
  useEffect(() => {
    const all = getStoredAttempts();
    const filtered = challengeId
      ? all.filter((a) => a.challengeId === challengeId)
      : all;
    setAttempts(filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setIsLoading(false);
  }, [challengeId]);

  // Save a new attempt
  const saveAttempt = useCallback(
    (attempt: Omit<Attempt, "id" | "createdAt">) => {
      const newAttempt: Attempt = {
        ...attempt,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const all = getStoredAttempts();
      all.push(newAttempt);
      saveAttempts(all);

      setAttempts((prev) => [newAttempt, ...prev]);
      return newAttempt;
    },
    []
  );

  // Get best score for a challenge
  const getBestScore = useCallback(
    (cId?: string) => {
      const targetId = cId || challengeId;
      if (!targetId) return 0;

      const all = getStoredAttempts();
      const challengeAttempts = all.filter((a) => a.challengeId === targetId);
      if (challengeAttempts.length === 0) return 0;

      return Math.max(...challengeAttempts.map((a) => a.finalScore));
    },
    [challengeId]
  );

  // Get all completed challenge IDs
  const getCompletedChallengeIds = useCallback(() => {
    const all = getStoredAttempts();
    return [...new Set(all.map((a) => a.challengeId))];
  }, []);

  // Get best scores for all challenges
  const getAllBestScores = useCallback(() => {
    const all = getStoredAttempts();
    const scores: Record<string, number> = {};
    for (const attempt of all) {
      if (
        !scores[attempt.challengeId] ||
        attempt.finalScore > scores[attempt.challengeId]
      ) {
        scores[attempt.challengeId] = attempt.finalScore;
      }
    }
    return scores;
  }, []);

  return {
    attempts,
    isLoading,
    saveAttempt,
    getBestScore,
    getCompletedChallengeIds,
    getAllBestScores,
    totalAttempts: attempts.length,
    bestScore: challengeId ? getBestScore(challengeId) : 0,
  };
}
