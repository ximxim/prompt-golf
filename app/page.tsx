import Link from "next/link";
import { ArrowRight, Trophy, Zap, Target, Users, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { challengeRegistry } from "@/lib/challenges/registry";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";

export default async function HomePage() {
  await challengeRegistry.initialize();
  const featured = challengeRegistry.getFeatured();

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
            <Link
              href="/progress"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Progress
            </Link>
            <Link href="/challenges">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
              <Zap className="w-4 h-4" />
              VimGolf for AI Prompting
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Master the Art of{" "}
              <span className="text-amber-400">AI Prompting</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed">
              Compete to write the most effective prompts for real business
              scenarios. Get scored by an AI judge. Climb the leaderboard. Level
              up your team.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/challenges">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-lg px-8"
                >
                  Start Playing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white text-lg px-8"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  1. Pick a Challenge
                </h3>
                <p className="text-sm text-slate-400">
                  Choose from real business scenarios — from CEO summaries to
                  stakeholder emails. Each one teaches specific prompting skills.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  2. Write Your Prompt
                </h3>
                <p className="text-sm text-slate-400">
                  Craft the perfect prompt for the scenario. Consider your
                  audience, structure, tone, and constraints. Beat the par time
                  for a bonus!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  3. Get Scored & Learn
                </h3>
                <p className="text-sm text-slate-400">
                  An AI judge evaluates your prompt across multiple dimensions.
                  Get detailed feedback, improve, and try again. Post your best
                  score to the leaderboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      {featured.length > 0 && (
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Featured Challenges
              </h2>
              <Link href="/challenges">
                <Button
                  variant="ghost"
                  className="text-amber-400 hover:text-amber-300"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((challenge) => (
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
                  isFeatured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400">
                {challengeRegistry.size}
              </div>
              <div className="text-sm text-slate-400 mt-1">Challenges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">5</div>
              <div className="text-sm text-slate-400 mt-1">
                Scoring Dimensions
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">9</div>
              <div className="text-sm text-slate-400 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">100</div>
              <div className="text-sm text-slate-400 mt-1">Max Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-lg">⛳</span>
            <span className="text-sm">Prompt Golf</span>
          </div>
          <p className="text-sm text-slate-500">
            A gamified prompt engineering training platform
          </p>
        </div>
      </footer>
    </div>
  );
}
