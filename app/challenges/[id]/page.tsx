"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ChallengeScenario } from "@/components/challenges/ChallengeScenario";
import { PromptEditor } from "@/components/prompt-input/PromptEditor";
import { useChallenge } from "@/hooks/useChallenge";

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const { id } = use(params);
  const { challenge, isLoading, error } = useChallenge(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-slate-400">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Challenge not found</p>
          <Link href="/challenges">
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/challenges">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">
                {challenge.metadata.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <DifficultyBadge level={challenge.metadata.difficulty} />
                <CategoryPill category={challenge.metadata.category} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left: Challenge Context */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-y-auto">
            <ChallengeScenario challenge={challenge} />
          </div>

          {/* Right: Prompt Interface */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
            <PromptEditor challenge={challenge} />
          </div>
        </div>
      </main>
    </div>
  );
}
