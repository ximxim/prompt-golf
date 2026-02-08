"use client";

import { CheckCircle2, ArrowUpCircle, Lightbulb } from "lucide-react";

interface ScoreFeedbackProps {
  feedback: {
    whatYouDidWell: string;
    primaryImprovement: string;
    secondaryImprovement?: string;
  };
}

export function ScoreFeedback({ feedback }: ScoreFeedbackProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        Feedback
      </h4>

      {/* What went well */}
      <div className="flex gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-emerald-400 mb-1">
            What you did well
          </p>
          <p className="text-sm text-slate-300">{feedback.whatYouDidWell}</p>
        </div>
      </div>

      {/* Primary improvement */}
      <div className="flex gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <ArrowUpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400 mb-1">
            Top improvement
          </p>
          <p className="text-sm text-slate-300">
            {feedback.primaryImprovement}
          </p>
        </div>
      </div>

      {/* Secondary improvement */}
      {feedback.secondaryImprovement && (
        <div className="flex gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
          <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-400 mb-1">Also consider</p>
            <p className="text-sm text-slate-300">
              {feedback.secondaryImprovement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
