"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-slate-400">
          An unexpected error occurred. Don&apos;t worry, your progress is saved
          locally.
        </p>
        <Button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
