"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { ChallengeCategory } from "@/lib/challenges/types";
import { useAttempts } from "@/hooks/useAttempts";
import { OnboardingOverlay } from "@/components/shared/OnboardingOverlay";

interface ChallengeListItem {
  id: string;
  version: string;
  metadata: {
    title: string;
    shortDescription: string;
    category: ChallengeCategory;
    difficulty: number;
    estimatedMinutes: number;
    tags: string[];
  };
  flags?: {
    isFeatured: boolean;
  };
  content: {
    scenario: {
      headline: string;
    };
  };
  scoring: {
    maxScore: number;
  };
}

const difficultyFilters = [
  { value: 1, label: "Warm-up" },
  { value: 2, label: "Beginner" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllBestScores } = useAttempts();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch("/api/challenges");
        const data = await res.json();
        setChallenges(data.challenges || []);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const bestScores = getAllBestScores();

  // Filter challenges
  const filtered = challenges.filter((c) => {
    if (selectedCategory && c.metadata.category !== selectedCategory)
      return false;
    if (selectedDifficulty && c.metadata.difficulty !== selectedDifficulty)
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.metadata.title.toLowerCase().includes(q) ||
        c.metadata.shortDescription.toLowerCase().includes(q) ||
        c.metadata.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900">
      <OnboardingOverlay />
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
              className="text-sm text-white font-medium"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Challenges</h1>
          <p className="text-slate-400">
            Pick a business scenario and craft the perfect prompt. Each
            challenge teaches specific prompting skills.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null
                  ? "bg-amber-500 text-slate-900"
                  : "border-slate-600 text-slate-400"
              }
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-900"
                    : "border-slate-600 text-slate-400"
                }
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Difficulty filters */}
          <div className="flex flex-wrap gap-2">
            {difficultyFilters.map((df) => (
              <Button
                key={df.value}
                variant={
                  selectedDifficulty === df.value ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === df.value ? null : df.value
                  )
                }
                className={
                  selectedDifficulty === df.value
                    ? "bg-amber-500 text-slate-900"
                    : "border-slate-600 text-slate-400"
                }
              >
                {"★".repeat(df.value)} {df.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 bg-slate-800" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No challenges match your filters.
            </p>
            <Button
              variant="ghost"
              className="mt-4 text-amber-400"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                id={challenge.id}
                title={challenge.metadata.title}
                shortDescription={challenge.metadata.shortDescription}
                category={challenge.metadata.category}
                difficulty={challenge.metadata.difficulty}
                estimatedMinutes={challenge.metadata.estimatedMinutes}
                headline={challenge.content.scenario.headline}
                maxScore={challenge.scoring.maxScore}
                bestScore={bestScores[challenge.id]}
                isFeatured={challenge.flags?.isFeatured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
