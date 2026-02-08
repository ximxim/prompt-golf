"use client";

import { useState, useEffect } from "react";
import { ChallengeConfig } from "@/lib/challenges/types";

export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState<ChallengeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchChallenge() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/challenges/${challengeId}`);
        if (!response.ok) {
          throw new Error("Challenge not found");
        }
        const data = await response.json();
        if (!cancelled) {
          setChallenge(data.challenge);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load challenge"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchChallenge();

    return () => {
      cancelled = true;
    };
  }, [challengeId]);

  return { challenge, isLoading, error };
}
