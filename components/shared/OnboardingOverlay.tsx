"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Zap, Target, Trophy, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ONBOARDING_KEY = "prompt-golf-onboarding-complete";

const steps = [
  {
    icon: Zap,
    title: "Welcome to Prompt Golf!",
    description:
      "Learn to write better AI prompts through gamified challenges. Each challenge is a real business scenario where your prompting skills make the difference.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Target,
    title: "Pick a Challenge",
    description:
      "Start with warm-up challenges and progress to expert level. Each one teaches specific skills like clarity, context-setting, and structured output design.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    title: "Write Your Best Prompt",
    description:
      "Read the scenario, understand the constraints, and craft your prompt. Use the hints and examples if you need guidance. Beat the par time for a bonus!",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Trophy,
    title: "Get Scored & Improve",
    description:
      "An AI judge scores your prompt across multiple dimensions with detailed feedback. Learn from each attempt, improve, and climb the leaderboard!",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

export function OnboardingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-lg mx-4 shadow-2xl">
        <CardContent className="pt-6 space-y-6">
          {/* Close button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-slate-500 hover:text-white -mt-2 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Step content */}
          <div className="text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mx-auto`}
            >
              <StepIcon className={`w-8 h-8 ${step.color}`} />
            </div>

            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "bg-amber-400 w-6"
                    : i < currentStep
                      ? "bg-amber-400/50"
                      : "bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-slate-500"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                "Start Playing!"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
