export interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  criteria: AchievementCriteria;
}

export type AchievementCriteria =
  | { type: "first_challenge" }
  | { type: "challenge_score"; challengeId?: string; threshold: number }
  | { type: "total_challenges"; count: number }
  | { type: "total_points"; points: number }
  | { type: "perfect_score"; challengeId?: string }
  | { type: "speed_run"; parTimeBeaten: boolean }
  | { type: "category_mastery"; category: string; count: number }
  | { type: "streak"; days: number }
  | { type: "all_categories" };

export const achievements: AchievementConfig[] = [
  // Common
  {
    id: "first-swing",
    name: "First Swing",
    description: "Complete your first challenge",
    icon: "⛳",
    rarity: "common",
    points: 10,
    criteria: { type: "first_challenge" },
  },
  {
    id: "passing-grade",
    name: "Passing Grade",
    description: "Score 45+ on any challenge",
    icon: "✅",
    rarity: "common",
    points: 10,
    criteria: { type: "challenge_score", threshold: 45 },
  },
  {
    id: "three-peat",
    name: "Three-Peat",
    description: "Complete 3 different challenges",
    icon: "🎯",
    rarity: "common",
    points: 20,
    criteria: { type: "total_challenges", count: 3 },
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Earn 100 total points",
    icon: "🌱",
    rarity: "common",
    points: 15,
    criteria: { type: "total_points", points: 100 },
  },

  // Rare
  {
    id: "good-form",
    name: "Good Form",
    description: "Score 65+ on any challenge",
    icon: "👍",
    rarity: "rare",
    points: 25,
    criteria: { type: "challenge_score", threshold: 65 },
  },
  {
    id: "half-way",
    name: "Halfway There",
    description: "Complete 5 different challenges",
    icon: "🏔️",
    rarity: "rare",
    points: 30,
    criteria: { type: "total_challenges", count: 5 },
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Beat the par time on any challenge",
    icon: "⚡",
    rarity: "rare",
    points: 25,
    criteria: { type: "speed_run", parTimeBeaten: true },
  },
  {
    id: "point-collector",
    name: "Point Collector",
    description: "Earn 300 total points",
    icon: "💰",
    rarity: "rare",
    points: 30,
    criteria: { type: "total_points", points: 300 },
  },

  // Epic
  {
    id: "excellent-craft",
    name: "Excellent Craft",
    description: "Score 85+ (Excellent) on any challenge",
    icon: "🌟",
    rarity: "epic",
    points: 50,
    criteria: { type: "challenge_score", threshold: 85 },
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete 8 different challenges",
    icon: "🏆",
    rarity: "epic",
    points: 50,
    criteria: { type: "total_challenges", count: 8 },
  },
  {
    id: "versatile",
    name: "Versatile",
    description: "Complete challenges in 3 different categories",
    icon: "🎨",
    rarity: "epic",
    points: 40,
    criteria: { type: "category_mastery", category: "any", count: 3 },
  },
  {
    id: "big-scorer",
    name: "Big Scorer",
    description: "Earn 500 total points",
    icon: "💎",
    rarity: "epic",
    points: 50,
    criteria: { type: "total_points", points: 500 },
  },

  // Legendary
  {
    id: "perfect-prompt",
    name: "Perfect Prompt",
    description: "Score 95+ on any challenge",
    icon: "👑",
    rarity: "legendary",
    points: 100,
    criteria: { type: "challenge_score", threshold: 95 },
  },
  {
    id: "master-prompter",
    name: "Master Prompter",
    description: "Complete all 10 challenges",
    icon: "🧙",
    rarity: "legendary",
    points: 100,
    criteria: { type: "total_challenges", count: 10 },
  },
  {
    id: "renaissance",
    name: "Renaissance",
    description: "Complete a challenge in every available category",
    icon: "🌈",
    rarity: "legendary",
    points: 75,
    criteria: { type: "all_categories" },
  },
  {
    id: "elite-scorer",
    name: "Elite Scorer",
    description: "Earn 800 total points",
    icon: "🔥",
    rarity: "legendary",
    points: 100,
    criteria: { type: "total_points", points: 800 },
  },
];
