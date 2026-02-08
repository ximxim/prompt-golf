"use client";

import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ChallengeCategory } from "@/lib/challenges/types";

interface ChallengeCardProps {
  id: string;
  title: string;
  shortDescription: string;
  category: ChallengeCategory;
  difficulty: number;
  estimatedMinutes: number;
  headline: string;
  bestScore?: number;
  maxScore: number;
  isFeatured?: boolean;
}

export function ChallengeCard({
  id,
  title,
  shortDescription,
  category,
  difficulty,
  estimatedMinutes,
  headline,
  bestScore,
  maxScore,
  isFeatured,
}: ChallengeCardProps) {
  const isCompleted = bestScore !== undefined && bestScore > 0;
  const scorePercentage = bestScore
    ? Math.round((bestScore / maxScore) * 100)
    : 0;

  return (
    <Link href={`/challenges/${id}`}>
      <Card
        className={`group h-full transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer
        ${isFeatured ? "border-amber-500/30 bg-amber-500/5" : "bg-slate-800/50 border-slate-700"}
      `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DifficultyBadge level={difficulty} />
              {isFeatured && (
                <span className="text-xs text-amber-400 font-medium">
                  Featured
                </span>
              )}
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  {scorePercentage}%
                </span>
              </div>
            )}
          </div>
          <CardTitle className="text-white group-hover:text-amber-400 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {shortDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500 italic">&ldquo;{headline}&rdquo;</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CategoryPill category={category} />
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {estimatedMinutes} min
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
