"use client";

import { useState } from "react";
import {
  Target,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChallengeConfig } from "@/lib/challenges/types";

interface ChallengeScenarioProps {
  challenge: ChallengeConfig;
}

export function ChallengeScenario({ challenge }: ChallengeScenarioProps) {
  const [showExamples, setShowExamples] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
  const { content } = challenge;

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Scenario */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">
          {content.scenario.headline}
        </h2>

        {content.scenario.persona && (
          <Badge
            variant="outline"
            className="bg-slate-700/50 text-slate-300 border-slate-600"
          >
            {content.scenario.persona}
          </Badge>
        )}

        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
          {content.scenario.context}
        </p>

        {content.scenario.constraints &&
          content.scenario.constraints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Constraints
              </h4>
              <ul className="space-y-1">
                {content.scenario.constraints.map((constraint, i) => (
                  <li
                    key={i}
                    className="text-sm text-slate-400 flex items-start gap-2"
                  >
                    <span className="text-amber-400 mt-0.5">•</span>
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      <Separator className="bg-slate-700" />

      {/* Success Criteria */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          What Success Looks Like
        </h3>

        <p className="text-slate-300 text-sm">
          {content.successCriteria.idealOutcome}
        </p>

        {content.successCriteria.mustInclude &&
          content.successCriteria.mustInclude.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Your prompt should include:
              </p>
              {content.successCriteria.mustInclude.map((item, i) => (
                <div
                  key={i}
                  className="text-sm text-slate-400 flex items-start gap-2"
                >
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  {item}
                </div>
              ))}
            </div>
          )}

        {content.successCriteria.mustAvoid &&
          content.successCriteria.mustAvoid.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Avoid:
              </p>
              {content.successCriteria.mustAvoid.map((item, i) => (
                <div
                  key={i}
                  className="text-sm text-slate-400 flex items-start gap-2"
                >
                  <span className="text-red-400 mt-0.5">✗</span>
                  {item}
                </div>
              ))}
            </div>
          )}
      </div>

      <Separator className="bg-slate-700" />

      {/* Educational Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Skills You&apos;ll Practice
        </h3>

        <div className="flex flex-wrap gap-2">
          {content.educational.skillsTaught.map((skill, i) => (
            <Badge
              key={i}
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {content.educational.conceptExplanation && (
          <p className="text-sm text-slate-400 leading-relaxed">
            {content.educational.conceptExplanation}
          </p>
        )}
      </div>

      <Separator className="bg-slate-700" />

      {/* Examples (Collapsible) */}
      <Collapsible open={showExamples} onOpenChange={setShowExamples}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            <span className="flex items-center gap-2">
              {showExamples ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showExamples ? "Hide" : "Show"} Examples
            </span>
            {showExamples ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 mt-3">
          {/* Bad Example */}
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-red-400">
                Poor Example
              </span>
              {content.educational.badExample.score !== undefined && (
                <Badge className="bg-red-500/20 text-red-400 border-0">
                  Score: {content.educational.badExample.score}
                </Badge>
              )}
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded p-3">
              {content.educational.badExample.prompt}
            </pre>
            <p className="text-xs text-red-300">
              {content.educational.badExample.explanation}
            </p>
          </div>

          {/* Good Example */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-400">
                Good Example
              </span>
              {content.educational.goodExample.score !== undefined && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                  Score: {content.educational.goodExample.score}
                </Badge>
              )}
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded p-3">
              {content.educational.goodExample.prompt}
            </pre>
            <p className="text-xs text-emerald-300">
              {content.educational.goodExample.explanation}
            </p>
          </div>

          {/* Expert Example (hidden by default) */}
          {content.educational.expertExample && (
            <Collapsible open={showExpert} onOpenChange={setShowExpert}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-400 hover:text-amber-300"
                >
                  {showExpert ? "Hide" : "Reveal"} Expert Example
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-amber-400">
                      Expert Example
                    </span>
                    {content.educational.expertExample.score !== undefined && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-0">
                        Score: {content.educational.expertExample.score}
                      </Badge>
                    )}
                  </div>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded p-3">
                    {content.educational.expertExample.prompt}
                  </pre>
                  <p className="text-xs text-amber-300">
                    {content.educational.expertExample.explanation}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Seed Data */}
      {content.seedData && (
        <>
          <Separator className="bg-slate-700" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Reference Data
            </h4>
            <p className="text-xs text-slate-500">
              {content.seedData.description}
            </p>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded p-3 max-h-48 overflow-y-auto">
              {content.seedData.content}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
