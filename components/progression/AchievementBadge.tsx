"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AchievementConfig } from "@/lib/achievements/config";

interface AchievementBadgeProps {
  achievement: AchievementConfig;
  earned: boolean;
  size?: "sm" | "md" | "lg";
}

const rarityColors = {
  common: "border-slate-500/30 bg-slate-500/10",
  rare: "border-blue-500/30 bg-blue-500/10",
  epic: "border-purple-500/30 bg-purple-500/10",
  legendary: "border-amber-500/30 bg-amber-500/10 shadow-lg shadow-amber-500/5",
};

const rarityTextColors = {
  common: "text-slate-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
};

const sizes = {
  sm: "w-10 h-10 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
};

export function AchievementBadge({
  achievement,
  earned,
  size = "md",
}: AchievementBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              ${sizes[size]} rounded-xl border-2 flex items-center justify-center
              transition-all duration-300 cursor-pointer
              ${
                earned
                  ? `${rarityColors[achievement.rarity]} hover:scale-110`
                  : "border-slate-700/50 bg-slate-800/50 opacity-40 grayscale"
              }
            `}
          >
            <span className={earned ? "" : "opacity-50"}>
              {achievement.icon}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-slate-800 border-slate-700 text-white max-w-xs"
          side="bottom"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{achievement.name}</span>
              <span
                className={`text-xs capitalize ${rarityTextColors[achievement.rarity]}`}
              >
                {achievement.rarity}
              </span>
            </div>
            <p className="text-sm text-slate-400">{achievement.description}</p>
            {earned ? (
              <p className="text-xs text-emerald-400">
                Earned! +{achievement.points} pts
              </p>
            ) : (
              <p className="text-xs text-slate-500">Not yet earned</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
