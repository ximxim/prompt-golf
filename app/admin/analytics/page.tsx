"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Attempt } from "@/hooks/useAttempts";

interface ChallengeStats {
  id: string;
  title: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
}

export default function AdminAnalyticsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [challengeInfos, setChallengeInfos] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    try {
      const attemptsRaw = localStorage.getItem("prompt-golf-attempts");
      setAttempts(attemptsRaw ? JSON.parse(attemptsRaw) : []);
    } catch {
      // Ignore
    }

    // Load challenge titles
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        const infos: Record<string, string> = {};
        for (const c of data.challenges || []) {
          infos[c.id] = c.metadata.title;
        }
        setChallengeInfos(infos);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const challengeStats = useMemo((): ChallengeStats[] => {
    const stats: Record<
      string,
      { attempts: number; scores: number[]; best: number }
    > = {};

    for (const attempt of attempts) {
      if (!stats[attempt.challengeId]) {
        stats[attempt.challengeId] = { attempts: 0, scores: [], best: 0 };
      }
      stats[attempt.challengeId].attempts++;
      stats[attempt.challengeId].scores.push(attempt.finalScore);
      stats[attempt.challengeId].best = Math.max(
        stats[attempt.challengeId].best,
        attempt.finalScore
      );
    }

    return Object.entries(stats)
      .map(([id, data]) => ({
        id,
        title: challengeInfos[id] || id,
        attempts: data.attempts,
        averageScore: Math.round(
          data.scores.reduce((a, b) => a + b, 0) / data.scores.length
        ),
        bestScore: data.best,
        completionRate: Math.round(
          (data.scores.filter((s) => s >= 45).length / data.scores.length) * 100
        ),
      }))
      .sort((a, b) => b.attempts - a.attempts);
  }, [attempts, challengeInfos]);

  const overallStats = useMemo(() => {
    if (attempts.length === 0)
      return {
        totalAttempts: 0,
        avgScore: 0,
        passingRate: 0,
        excellentRate: 0,
      };

    const scores = attempts.map((a) => a.finalScore);
    return {
      totalAttempts: attempts.length,
      avgScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      passingRate: Math.round(
        (scores.filter((s) => s >= 45).length / scores.length) * 100
      ),
      excellentRate: Math.round(
        (scores.filter((s) => s >= 85).length / scores.length) * 100
      ),
    };
  }, [attempts]);

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Admin
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-white">Analytics</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {overallStats.totalAttempts}
              </div>
              <p className="text-sm text-slate-400 mt-1">Total Attempts</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {overallStats.avgScore}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Average Score</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-emerald-400">
                {overallStats.passingRate}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Passing Rate</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-amber-400">
                {overallStats.excellentRate}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Excellent Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Per-Challenge Stats */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Challenge Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challengeStats.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No attempt data yet. Play some challenges to see analytics!
              </p>
            ) : (
              challengeStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {stat.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {stat.attempts} attempt{stat.attempts !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400">Avg</p>
                      <p className="text-white font-semibold">
                        {stat.averageScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Best</p>
                      <p className="text-amber-400 font-semibold">
                        {stat.bestScore}
                      </p>
                    </div>
                    <div className="w-24">
                      <p className="text-xs text-slate-400 mb-1">
                        Pass: {stat.completionRate}%
                      </p>
                      <Progress
                        value={stat.completionRate}
                        className="h-2 bg-slate-600"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
