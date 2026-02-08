import { Badge } from "@/components/ui/badge";

interface DifficultyBadgeProps {
  level: number;
  showLabel?: boolean;
}

const difficultyConfig: Record<
  number,
  { label: string; className: string; stars: number }
> = {
  1: {
    label: "Warm-up",
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    stars: 1,
  },
  2: {
    label: "Beginner",
    className:
      "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    stars: 2,
  },
  3: {
    label: "Intermediate",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    stars: 3,
  },
  4: {
    label: "Advanced",
    className:
      "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
    stars: 4,
  },
  5: {
    label: "Expert",
    className:
      "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    stars: 5,
  },
};

export function DifficultyBadge({
  level,
  showLabel = true,
}: DifficultyBadgeProps) {
  const config = difficultyConfig[level] || difficultyConfig[1];

  return (
    <Badge variant="outline" className={config.className}>
      <span className="mr-1">
        {"★".repeat(config.stars)}
        {"☆".repeat(5 - config.stars)}
      </span>
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}
