"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AchievementBadge } from "@/components/progression/AchievementBadge";
import { SkillRadar } from "@/components/progression/SkillRadar";
import { useAttempts, Attempt } from "@/hooks/useAttempts";
import { achievements } from "@/lib/achievements/config";
import {
  getEarnedAchievements,
  checkAchievements,
  saveEarnedAchievements,
} from "@/lib/achievements/checker";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";

interface ChallengeInfo {
  id: string;
  title: string;
  difficulty: number;
  category: string;
  maxScore: number;
}

export default function ProgressPage() {
  const { attempts, getAllBestScores, getCompletedChallengeIds } = useAttempts();
  const [challengeInfos, setChallengeInfos] = useState<ChallengeInfo[]>([]);
  const [earnedIds, setEarnedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load challenge metadata and check achievements
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/challenges");
        const data = await res.json();
        const infos = (data.challenges || []).map(
          (c: {
            id: string;
            metadata: { title: string; difficulty: number; category: string };
            scoring: { maxScore: number };
          }) => ({
            id: c.id,
            title: c.metadata.title,
            difficulty: c.metadata.difficulty,
            category: c.metadata.category,
            maxScore: c.scoring.maxScore,
          })
        );
        setChallengeInfos(infos);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      }

      // Load earned achievements
      const earned = getEarnedAchievements();
      setEarnedIds(earned);

      setIsLoading(false);
    }

    load();
  }, []);

  // Check for new achievements
  useEffect(() => {
    if (isLoading || attempts.length === 0) return;

    const bestScores = getAllBestScores();
    const completedIds = getCompletedChallengeIds();
    const totalPoints = Object.values(bestScores).reduce(
      (sum, s) => sum + s,
      0
    );

    // Get categories of completed challenges
    const completedCategories = new Set<string>();
    for (const info of challengeInfos) {
      if (completedIds.includes(info.id)) {
        completedCategories.add(info.category);
      }
    }

    const newAchievements = checkAchievements({
      completedChallengeIds: completedIds,
      bestScores,
      totalPoints,
      categories: Array.from(completedCategories),
      earnedAchievementIds: earnedIds,
      parTimesBeaten: false, // TODO: track this
    });

    if (newAchievements.length > 0) {
      const updated = [...earnedIds, ...newAchievements.map((a) => a.id)];
      setEarnedIds(updated);
      saveEarnedAchievements(updated);
    }
  }, [
    isLoading,
    attempts,
    challengeInfos,
    earnedIds,
    getAllBestScores,
    getCompletedChallengeIds,
  ]);

  const bestScores = getAllBestScores();
  const completedIds = getCompletedChallengeIds();
  const totalPoints = Object.values(bestScores).reduce(
    (sum, s) => sum + s,
    0
  );
  const averageScore =
    completedIds.length > 0
      ? Math.round(totalPoints / completedIds.length)
      : 0;

  // Calculate skill scores from attempts
  const skillScores = useMemo(() => {
    const skills: Record<string, { total: number; count: number }> = {};
    for (const attempt of attempts) {
      if (attempt.dimensions) {
        for (const [dimId, dim] of Object.entries(attempt.dimensions)) {
          if (!skills[dimId]) skills[dimId] = { total: 0, count: 0 };
          skills[dimId].total += (dim.score / dim.maxScore) * 100;
          skills[dimId].count += 1;
        }
      }
    }

    return Object.fromEntries(
      Object.entries(skills).map(([id, { total, count }]) => [
        id,
        Math.round(total / count),
      ])
    );
  }, [attempts]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⛳</span>
            <span className="text-xl font-bold text-white">Prompt Golf</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/challenges"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            <Link href="/progress" className="text-sm text-white font-medium">
              Progress
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-amber-400" />
          Your Progress
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-amber-400">
                {totalPoints}
              </div>
              <p className="text-sm text-slate-400 mt-1">Total Points</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {completedIds.length}/{challengeInfos.length}
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Challenges Completed
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {averageScore}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Average Score</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {attempts.length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Total Attempts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skill Radar */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Skill Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(skillScores).length > 0 ? (
                <SkillRadar skills={skillScores} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <p>Complete a challenge to see your skill profile</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievements ({earnedIds.length}/{achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    earned={earnedIds.includes(achievement.id)}
                    size="md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Map */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Challenge Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {challengeInfos.map((info) => {
                const score = bestScores[info.id];
                const completed = completedIds.includes(info.id);
                const percentage = score
                  ? Math.round((score / info.maxScore) * 100)
                  : 0;

                return (
                  <Link
                    key={info.id}
                    href={`/challenges/${info.id}`}
                    className="block"
                  >
                    <div
                      className={`
                      flex items-center gap-4 p-4 rounded-lg border transition-all
                      ${
                        completed
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                          : "bg-slate-700/30 border-slate-700 hover:border-slate-600"
                      }
                    `}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${completed ? "text-white" : "text-slate-300"}`}
                          >
                            {info.title}
                          </span>
                          <DifficultyBadge
                            level={info.difficulty}
                            showLabel={false}
                          />
                        </div>
                        {completed && (
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={percentage}
                              className="h-1.5 bg-slate-700 flex-1 max-w-32"
                            />
                            <span className="text-xs text-slate-400">
                              {score}/{info.maxScore}
                            </span>
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
