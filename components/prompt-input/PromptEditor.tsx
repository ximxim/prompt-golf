"use client";

import { useState } from "react";
import { Send, Loader2, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScoring } from "@/hooks/useScoring";
import { useTimer } from "@/hooks/useTimer";
import { useAttempts } from "@/hooks/useAttempts";
import { Timer, formatTime } from "@/components/shared/Timer";
import { ChallengeConfig } from "@/lib/challenges/types";
import { ScoreDisplay } from "@/components/scoring/ScoreDisplay";

interface PromptEditorProps {
  challenge: ChallengeConfig;
}

export function PromptEditor({ challenge }: PromptEditorProps) {
  const [prompt, setPrompt] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { elapsedSeconds, isRunning, startTimer, stopTimer, resetTimer } =
    useTimer();
  const { score, isScoring, error, submitForScoring, reset: resetScoring } =
    useScoring(challenge.id);
  const { saveAttempt, bestScore, totalAttempts } = useAttempts(challenge.id);

  // Start timer on first keystroke
  const handlePromptChange = (value: string) => {
    if (!isRunning && value.length === 1) {
      startTimer();
    }
    setPrompt(value);
  };

  // Submit prompt for scoring
  const handleSubmit = async () => {
    if (!prompt.trim() || isScoring) return;

    stopTimer();
    setHasSubmitted(true);

    await submitForScoring(prompt, elapsedSeconds);
  };

  // Reset for another attempt
  const handleReset = () => {
    setPrompt("");
    setHasSubmitted(false);
    resetTimer();
    resetScoring();
  };

  // Character count hints
  const charCount = prompt.length;
  const isShort = charCount > 0 && charCount < 50;
  const isLong = charCount > 500;

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Your Prompt</h3>
          {totalAttempts > 0 && (
            <span className="text-xs text-slate-500">
              Best: {bestScore}/{challenge.scoring.maxScore} | Attempts:{" "}
              {totalAttempts}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-slate-400 hover:text-amber-400"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint
          </Button>
          {hasSubmitted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          )}
        </div>
      </div>

      {/* Hint Panel */}
      {showHint && (
        <div className="px-4 py-3 bg-amber-900/20 border-b border-amber-700/50">
          <p className="text-sm text-amber-300">
            <strong>Tip:</strong> Think about WHO needs this output and WHY.
            Specify the format you want (bullets? paragraphs? table?). Consider
            including: audience, tone, length constraints, and specific focus
            areas.
          </p>
        </div>
      )}

      {/* Score Display (appears after submission) */}
      {score && hasSubmitted && (
        <ScoreDisplay
          score={score}
          challenge={challenge}
          elapsedSeconds={elapsedSeconds}
          onTryAgain={handleReset}
        />
      )}

      {/* Main Editor */}
      {!score && (
        <div className="flex-1 p-4">
          <Textarea
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="Write your prompt here... Start typing to begin the timer."
            className="h-full min-h-[300px] bg-slate-900 border-slate-600 
                       text-white placeholder:text-slate-500 resize-none
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={hasSubmitted}
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="px-4 py-3 bg-red-900/20 border-t border-red-700/50">
          <p className="text-sm text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Editor Footer */}
      <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {!score && (
            <span
              className={`${isShort ? "text-yellow-400" : isLong ? "text-red-400" : "text-slate-400"}`}
            >
              {charCount} characters
              {isShort && " (seems short!)"}
              {isLong && " (might be verbose)"}
            </span>
          )}
          {(elapsedSeconds > 0 || isRunning) && (
            <Timer
              elapsedSeconds={elapsedSeconds}
              parTimeSeconds={challenge.scoring.timeBonus?.parTimeSeconds}
              isRunning={isRunning}
            />
          )}
        </div>

        {!score && (
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isScoring || hasSubmitted}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
          >
            {isScoring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Prompt
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
