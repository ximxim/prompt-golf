"use client";

import { Progress } from "@/components/ui/progress";
import { ScoringDimension } from "@/lib/challenges/types";

interface ScoreDimensionsProps {
  dimensions: Record<
    string,
    {
      score: number;
      feedback: string;
    }
  >;
  challengeDimensions: ScoringDimension[];
}

function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 90) return "text-emerald-400";
  if (pct >= 70) return "text-blue-400";
  if (pct >= 50) return "text-amber-400";
  return "text-red-400";
}

function getProgressColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 90) return "[&>div]:bg-emerald-500";
  if (pct >= 70) return "[&>div]:bg-blue-500";
  if (pct >= 50) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

export function ScoreDimensions({
  dimensions,
  challengeDimensions,
}: ScoreDimensionsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        Score Breakdown
      </h4>

      {challengeDimensions.map((dim) => {
        const result = dimensions[dim.id];
        if (!result) return null;

        const score = result.score;
        const percentage = (score / dim.maxPoints) * 100;

        return (
          <div key={dim.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{dim.name}</span>
              <span
                className={`text-sm font-mono font-semibold ${getScoreColor(score, dim.maxPoints)}`}
              >
                {score}/{dim.maxPoints}
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 bg-slate-700 ${getProgressColor(score, dim.maxPoints)}`}
            />
            {result.feedback && (
              <p className="text-xs text-slate-400 mt-1">{result.feedback}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
