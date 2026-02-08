import { achievements, AchievementConfig } from "./config";

interface AttemptData {
  challengeId: string;
  finalScore: number;
  elapsedSeconds: number;
  category: string;
}

interface UserProgress {
  completedChallengeIds: string[];
  bestScores: Record<string, number>;
  totalPoints: number;
  categories: string[];
  earnedAchievementIds: string[];
  parTimesBeaten: boolean;
}

const ACHIEVEMENTS_STORAGE_KEY = "prompt-golf-achievements";

export function getEarnedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveEarnedAchievements(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(ids));
}

export function checkAchievements(progress: UserProgress): AchievementConfig[] {
  const newAchievements: AchievementConfig[] = [];

  for (const achievement of achievements) {
    // Skip already earned
    if (progress.earnedAchievementIds.includes(achievement.id)) continue;

    const earned = evaluateCriteria(achievement, progress);
    if (earned) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

function evaluateCriteria(
  achievement: AchievementConfig,
  progress: UserProgress
): boolean {
  const { criteria } = achievement;

  switch (criteria.type) {
    case "first_challenge":
      return progress.completedChallengeIds.length >= 1;

    case "challenge_score": {
      if (criteria.challengeId) {
        return (progress.bestScores[criteria.challengeId] || 0) >= criteria.threshold;
      }
      return Object.values(progress.bestScores).some(
        (s) => s >= criteria.threshold
      );
    }

    case "total_challenges":
      return progress.completedChallengeIds.length >= criteria.count;

    case "total_points":
      return progress.totalPoints >= criteria.points;

    case "perfect_score": {
      if (criteria.challengeId) {
        return (progress.bestScores[criteria.challengeId] || 0) >= 100;
      }
      return Object.values(progress.bestScores).some((s) => s >= 100);
    }

    case "speed_run":
      return progress.parTimesBeaten;

    case "category_mastery":
      if (criteria.category === "any") {
        return progress.categories.length >= criteria.count;
      }
      return progress.categories.includes(criteria.category);

    case "all_categories":
      // Check if user has completed at least one challenge in every available category
      const requiredCategories = [
        "summarization",
        "communication",
        "analysis",
        "planning",
        "automation",
        "strategy",
        "roleplay",
        "meta-prompting",
      ];
      return requiredCategories.every((cat) =>
        progress.categories.includes(cat)
      );

    case "streak":
      return false; // Streak tracking requires date-based logic

    default:
      return false;
  }
}

export function getAchievementById(id: string): AchievementConfig | undefined {
  return achievements.find((a) => a.id === id);
}

export function getAchievementsByRarity(
  rarity: AchievementConfig["rarity"]
): AchievementConfig[] {
  return achievements.filter((a) => a.rarity === rarity);
}
