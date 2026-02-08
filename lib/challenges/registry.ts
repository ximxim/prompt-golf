import { ChallengeConfig } from "./types";
import { challengeLoader } from "./loader";
import path from "path";

export class ChallengeRegistry {
  private challenges: Map<string, ChallengeConfig> = new Map();
  private initialized = false;

  /**
   * Initialize registry with all challenges from filesystem
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const challengesDir = path.join(process.cwd(), "challenges");
    const challenges = await challengeLoader.loadAllFromDirectory(challengesDir);

    for (const challenge of challenges) {
      this.challenges.set(challenge.id, challenge);
    }

    this.initialized = true;
    console.log(`[ChallengeRegistry] Loaded ${this.challenges.size} challenges`);
  }

  /**
   * Get challenge by ID
   */
  get(id: string): ChallengeConfig | undefined {
    return this.challenges.get(id);
  }

  /**
   * Get all challenges, optionally filtered
   */
  getAll(filters?: {
    category?: string;
    difficulty?: number;
    tags?: string[];
    tenantId?: string;
  }): ChallengeConfig[] {
    let challenges = Array.from(this.challenges.values());

    if (filters?.category) {
      challenges = challenges.filter(
        (c) => c.metadata.category === filters.category
      );
    }

    if (filters?.difficulty) {
      challenges = challenges.filter(
        (c) => c.metadata.difficulty === filters.difficulty
      );
    }

    if (filters?.tags?.length) {
      challenges = challenges.filter((c) =>
        filters.tags!.some((tag) => c.metadata.tags.includes(tag))
      );
    }

    if (filters?.tenantId) {
      challenges = challenges.filter(
        (c) =>
          !c.flags?.allowedTenants ||
          c.flags.allowedTenants.includes(filters.tenantId!)
      );
    }

    return challenges.sort(
      (a, b) => a.metadata.difficulty - b.metadata.difficulty
    );
  }

  /**
   * Get challenges by difficulty level name
   */
  getByLevel(
    level: "warm-up" | "beginner" | "intermediate" | "advanced" | "expert"
  ): ChallengeConfig[] {
    const difficultyMap = {
      "warm-up": 1,
      beginner: 2,
      intermediate: 3,
      advanced: 4,
      expert: 5,
    };

    return this.getAll({ difficulty: difficultyMap[level] });
  }

  /**
   * Get featured challenges
   */
  getFeatured(): ChallengeConfig[] {
    return Array.from(this.challenges.values()).filter(
      (c) => c.flags?.isFeatured
    );
  }

  /**
   * Get next challenges based on completed ones
   */
  getNextChallenges(
    completedIds: string[],
    scores: Record<string, number>
  ): ChallengeConfig[] {
    const next: ChallengeConfig[] = [];

    for (const challenge of this.challenges.values()) {
      if (completedIds.includes(challenge.id)) continue;

      const prereqs = challenge.progression.prerequisites || [];
      const prereqsMet = prereqs.every((prereqId) => {
        const completed = completedIds.includes(prereqId);
        const scoreReq = challenge.progression.unlockScore || 0;
        const hasScore = (scores[prereqId] || 0) >= scoreReq;
        return completed && hasScore;
      });

      if (prereqsMet) {
        next.push(challenge);
      }
    }

    return next.sort(
      (a, b) => a.metadata.difficulty - b.metadata.difficulty
    );
  }

  /**
   * Get total number of challenges
   */
  get size(): number {
    return this.challenges.size;
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const challenge of this.challenges.values()) {
      categories.add(challenge.metadata.category);
    }
    return Array.from(categories).sort();
  }

  /**
   * Reload all challenges
   */
  async reload(): Promise<void> {
    this.challenges.clear();
    this.initialized = false;
    challengeLoader.clearCache();
    await this.initialize();
  }
}

// Singleton instance
export const challengeRegistry = new ChallengeRegistry();
