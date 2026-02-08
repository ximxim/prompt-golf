"use client";

import { Clock, Zap } from "lucide-react";

interface TimerProps {
  elapsedSeconds: number;
  parTimeSeconds?: number;
  isRunning?: boolean;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Timer({
  elapsedSeconds,
  parTimeSeconds,
  isRunning,
}: TimerProps) {
  const isUnderPar = parTimeSeconds
    ? elapsedSeconds < parTimeSeconds
    : false;
  const isNearPar = parTimeSeconds
    ? elapsedSeconds > parTimeSeconds * 0.8 && elapsedSeconds < parTimeSeconds
    : false;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-1.5 font-mono text-sm ${
          isRunning
            ? isNearPar
              ? "text-amber-400"
              : isUnderPar
                ? "text-emerald-400"
                : "text-slate-400"
            : "text-slate-500"
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>{formatTime(elapsedSeconds)}</span>
      </div>

      {parTimeSeconds && isUnderPar && isRunning && (
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Zap className="w-3 h-3" />
          <span>Time bonus active</span>
        </div>
      )}

      {parTimeSeconds && !isRunning && elapsedSeconds === 0 && (
        <div className="text-xs text-slate-500">
          Par: {formatTime(parTimeSeconds)}
        </div>
      )}
    </div>
  );
}
