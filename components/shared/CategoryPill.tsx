import { Badge } from "@/components/ui/badge";
import { ChallengeCategory } from "@/lib/challenges/types";

interface CategoryPillProps {
  category: ChallengeCategory;
}

const categoryConfig: Record<
  ChallengeCategory,
  { label: string; className: string; icon: string }
> = {
  summarization: {
    label: "Summarization",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    icon: "📝",
  },
  communication: {
    label: "Communication",
    className: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    icon: "💬",
  },
  analysis: {
    label: "Analysis",
    className: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    icon: "📊",
  },
  documentation: {
    label: "Documentation",
    className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    icon: "📄",
  },
  strategy: {
    label: "Strategy",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: "🎯",
  },
  automation: {
    label: "Automation",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: "⚙️",
  },
  planning: {
    label: "Planning",
    className: "bg-lime-500/10 text-lime-400 border-lime-500/20",
    icon: "📋",
  },
  roleplay: {
    label: "Roleplay",
    className: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    icon: "🎭",
  },
  "meta-prompting": {
    label: "Meta-Prompting",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: "🧠",
  },
};

export function CategoryPill({ category }: CategoryPillProps) {
  const config = categoryConfig[category] || {
    label: category,
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: "📌",
  };

  return (
    <Badge variant="outline" className={config.className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
