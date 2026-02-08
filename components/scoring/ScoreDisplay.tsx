"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChallengeConfig } from "@/lib/challenges/types";
import { ScoreResultType } from "@/hooks/useScoring";
import { ScoreDimensions } from "./ScoreDimensions";
import { ScoreFeedback } from "./ScoreFeedback";

interface ScoreDisplayProps {
  score: ScoreResultType;
  challenge: ChallengeConfig;
  elapsedSeconds: number;
  onTryAgain: () => void;
}

const qualityColors = {
  excellent: "text-emerald-400",
  good: "text-blue-400",
  fair: "text-amber-400",
  poor: "text-red-400",
};

const qualityBg = {
  excellent: "bg-emerald-500",
  good: "bg-blue-500",
  fair: "bg-amber-500",
  poor: "bg-red-500",
};

export function ScoreDisplay({
  score,
  challenge,
  elapsedSeconds,
  onTryAgain,
}: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const percentage = Math.round(
    (score.totalScore / challenge.scoring.maxScore) * 100
  );
  const qualityLevel = score.promptQualityLevel;

  // Animate score counting up
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score.totalScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score.totalScore);
      setAnimatedScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedScore(score.totalScore);
        // Show details after animation
        setTimeout(() => setShowDetails(true), 300);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score.totalScore]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Main Score */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          {qualityLevel === "excellent" && (
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          )}
          <div
            className={`text-6xl font-bold tabular-nums ${qualityColors[qualityLevel]}`}
          >
            {animatedScore}
          </div>
          <span className="text-2xl text-slate-500 self-end mb-2">
            / {challenge.scoring.maxScore}
          </span>
        </div>

        <Progress
          value={(animatedScore / challenge.scoring.maxScore) * 100}
          className="h-3 bg-slate-700"
        />

        <div className="flex items-center justify-center gap-2">
          <span
            className={`text-lg font-semibold capitalize ${qualityColors[qualityLevel]}`}
          >
            {qualityLevel}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-sm text-slate-400">{percentage}%</span>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Dimension Breakdown */}
          <ScoreDimensions
            dimensions={score.dimensions}
            challengeDimensions={challenge.scoring.dimensions}
          />

          {/* Feedback */}
          <ScoreFeedback feedback={score.overallFeedback} />

          {/* Try Again */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={onTryAgain}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
