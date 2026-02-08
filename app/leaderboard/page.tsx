"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Trophy, Medal, Crown, Flame, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  totalPoints: number;
  challengesCompleted: number;
  averageScore: number;
  bestChallenge: string;
  streak: number;
}

// Generate leaderboard from localStorage data (pre-Supabase)
function generateLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const attemptsRaw = localStorage.getItem("prompt-golf-attempts");
    if (!attemptsRaw) return [];

    const attempts = JSON.parse(attemptsRaw);
    if (!attempts.length) return [];

    // Aggregate by "user" (in local mode, it's all one user)
    const bestScores: Record<string, number> = {};
    let totalAttempts = 0;

    for (const attempt of attempts) {
      totalAttempts++;
      if (
        !bestScores[attempt.challengeId] ||
        attempt.finalScore > bestScores[attempt.challengeId]
      ) {
        bestScores[attempt.challengeId] = attempt.finalScore;
      }
    }

    const totalPoints = Object.values(bestScores).reduce(
      (sum, s) => sum + s,
      0
    );
    const challengesCompleted = Object.keys(bestScores).length;
    const averageScore =
      challengesCompleted > 0
        ? Math.round(totalPoints / challengesCompleted)
        : 0;

    // Find best challenge
    let bestChallenge = "";
    let bestScore = 0;
    for (const [id, score] of Object.entries(bestScores)) {
      if (score > bestScore) {
        bestScore = score;
        bestChallenge = id;
      }
    }

    const entry: LeaderboardEntry = {
      rank: 1,
      userId: "local-user",
      displayName: "You",
      totalPoints,
      challengesCompleted,
      averageScore,
      bestChallenge,
      streak: 1,
    };

    // Add some sample entries for visual context
    const sampleEntries: LeaderboardEntry[] = [
      {
        rank: 0,
        userId: "sample-1",
        displayName: "Prompt Master",
        totalPoints: 850,
        challengesCompleted: 10,
        averageScore: 85,
        bestChallenge: "meta-prompt-builder",
        streak: 12,
      },
      {
        rank: 0,
        userId: "sample-2",
        displayName: "AI Whisperer",
        totalPoints: 720,
        challengesCompleted: 9,
        averageScore: 80,
        bestChallenge: "strategy-doc",
        streak: 7,
      },
      {
        rank: 0,
        userId: "sample-3",
        displayName: "Context Queen",
        totalPoints: 680,
        challengesCompleted: 8,
        averageScore: 85,
        bestChallenge: "crisis-comms",
        streak: 5,
      },
      {
        rank: 0,
        userId: "sample-4",
        displayName: "Structured Sam",
        totalPoints: 520,
        challengesCompleted: 7,
        averageScore: 74,
        bestChallenge: "process-automator",
        streak: 3,
      },
      {
        rank: 0,
        userId: "sample-5",
        displayName: "Clarity Chris",
        totalPoints: 430,
        challengesCompleted: 6,
        averageScore: 72,
        bestChallenge: "professional-email",
        streak: 2,
      },
    ];

    const all = challengesCompleted > 0
      ? [entry, ...sampleEntries]
      : sampleEntries;

    return all
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((e, i) => ({ ...e, rank: i + 1 }));
  } catch {
    return [];
  }
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm text-slate-400 w-5 text-center">{rank}</span>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = generateLocalLeaderboard();
    setEntries(data);
    setIsLoading(false);
  }, []);

  const currentUser = entries.find((e) => e.userId === "local-user");

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
              className="text-sm text-white font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/progress"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Progress
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              Leaderboard
            </h1>
            <p className="text-slate-400 mt-1">
              Top prompt engineers ranked by total points
            </p>
          </div>
        </div>

        {/* Current User Position */}
        {currentUser && (
          <Card className="bg-amber-500/5 border-amber-500/20 mb-6">
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getRankIcon(currentUser.rank)}
                <Avatar className="h-10 w-10 bg-amber-500/20">
                  <AvatarFallback className="bg-amber-500/20 text-amber-400">
                    You
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Your Position</p>
                  <p className="text-sm text-slate-400">
                    Rank #{currentUser.rank} | {currentUser.totalPoints} points
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-slate-400">Challenges</p>
                  <p className="text-white font-semibold">
                    {currentUser.challengesCompleted}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Avg Score</p>
                  <p className="text-white font-semibold">
                    {currentUser.averageScore}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Streak</p>
                  <p className="text-amber-400 font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {currentUser.streak}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="w-16 text-slate-400">Rank</TableHead>
                  <TableHead className="text-slate-400">Player</TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Points
                  </TableHead>
                  <TableHead className="text-slate-400 text-right hidden md:table-cell">
                    Challenges
                  </TableHead>
                  <TableHead className="text-slate-400 text-right hidden md:table-cell">
                    Avg Score
                  </TableHead>
                  <TableHead className="text-slate-400 text-right hidden lg:table-cell">
                    Streak
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow
                    key={entry.userId}
                    className={`border-slate-700 ${
                      entry.userId === "local-user"
                        ? "bg-amber-500/5"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={
                              entry.userId === "local-user"
                                ? "bg-amber-500/20 text-amber-400 text-xs"
                                : "bg-slate-600 text-slate-300 text-xs"
                            }
                          >
                            {getInitials(entry.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`font-medium ${
                            entry.userId === "local-user"
                              ? "text-amber-400"
                              : "text-white"
                          }`}
                        >
                          {entry.displayName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-white">
                        {entry.totalPoints}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <span className="text-slate-300">
                        {entry.challengesCompleted}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <span className="text-slate-300">
                        {entry.averageScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      {entry.streak > 0 && (
                        <span className="text-amber-400 flex items-center justify-end gap-1">
                          <Flame className="w-3 h-3" />
                          {entry.streak}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {entries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-slate-400"
                    >
                      No scores yet. Complete a challenge to appear on the
                      leaderboard!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
