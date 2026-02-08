import { z } from "zod";
import yaml from "js-yaml";
import { ChallengeConfig } from "./types";

// Zod schema for runtime validation
const ChallengeConfigSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  metadata: z.object({
    title: z.string().min(1).max(100),
    shortDescription: z.string().min(1).max(200),
    category: z.enum([
      "summarization",
      "communication",
      "analysis",
      "documentation",
      "strategy",
      "automation",
      "planning",
      "roleplay",
      "meta-prompting",
    ]),
    difficulty: z.number().min(1).max(5),
    estimatedMinutes: z.number().min(1).max(60),
    tags: z.array(z.string()),
    author: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  content: z.object({
    scenario: z.object({
      headline: z.string(),
      context: z.string(),
      constraints: z.array(z.string()).optional(),
      persona: z.string().optional(),
    }),
    successCriteria: z.object({
      idealOutcome: z.string(),
      mustInclude: z.array(z.string()).optional(),
      mustAvoid: z.array(z.string()).optional(),
    }),
    educational: z.object({
      skillsTaught: z.array(z.string()),
      conceptExplanation: z.string().optional(),
      badExample: z.object({
        prompt: z.string(),
        score: z.number().optional(),
        explanation: z.string(),
      }),
      goodExample: z.object({
        prompt: z.string(),
        score: z.number().optional(),
        explanation: z.string(),
      }),
      expertExample: z
        .object({
          prompt: z.string(),
          score: z.number().optional(),
          explanation: z.string(),
        })
        .optional(),
    }),
    seedData: z
      .object({
        type: z.enum(["text", "table", "json", "image-url"]),
        content: z.string(),
        description: z.string(),
      })
      .optional(),
  }),
  scoring: z.object({
    maxScore: z.number(),
    timeBonus: z
      .object({
        enabled: z.boolean(),
        maxBonusPercent: z.number(),
        parTimeSeconds: z.number(),
      })
      .optional(),
    dimensions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        weight: z.number(),
        maxPoints: z.number(),
        rubric: z.object({
          excellent: z.string(),
          good: z.string(),
          fair: z.string(),
          poor: z.string(),
        }),
      })
    ),
    judge: z.object({
      model: z.enum([
        "claude-sonnet-4-20250514",
        "gpt-4o",
        "claude-opus-4-20250514",
      ]),
      temperature: z.number(),
      systemPromptOverride: z.string().optional(),
    }),
    thresholds: z.object({
      excellent: z.number(),
      good: z.number(),
      passing: z.number(),
    }),
  }),
  progression: z.object({
    prerequisites: z.array(z.string()).optional(),
    unlockScore: z.number().optional(),
    nextChallenges: z.array(z.string()).optional(),
    retries: z.object({
      unlimited: z.boolean(),
      maxAttempts: z.number().optional(),
      cooldownSeconds: z.number().optional(),
    }),
  }),
  flags: z
    .object({
      isActive: z.boolean(),
      isFeatured: z.boolean(),
      isExperimental: z.boolean(),
      allowedTenants: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
});

export class ChallengeLoader {
  private cache: Map<string, ChallengeConfig> = new Map();

  /**
   * Load a challenge from YAML string
   */
  parseChallenge(yamlContent: string): ChallengeConfig {
    const parsed = yaml.load(yamlContent);
    const validated = ChallengeConfigSchema.parse(parsed);
    return validated as ChallengeConfig;
  }

  /**
   * Load challenge from file system (development)
   */
  async loadFromFile(path: string): Promise<ChallengeConfig> {
    const fs = await import("fs/promises");
    const content = await fs.readFile(path, "utf-8");
    return this.parseChallenge(content);
  }

  /**
   * Load all challenges from a directory
   */
  async loadAllFromDirectory(dirPath: string): Promise<ChallengeConfig[]> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const files = await fs.readdir(dirPath);
    const yamlFiles = files.filter(
      (f) => f.endsWith(".yaml") || f.endsWith(".yml")
    );

    const challenges: ChallengeConfig[] = [];
    for (const file of yamlFiles) {
      try {
        const challenge = await this.loadFromFile(
          path.join(dirPath, file)
        );
        if (challenge.flags?.isActive !== false) {
          challenges.push(challenge);
          this.cache.set(challenge.id, challenge);
        }
      } catch (e) {
        console.error(`Failed to load challenge from ${file}:`, e);
      }
    }

    return challenges;
  }

  /**
   * Get a cached challenge
   */
  getCached(id: string): ChallengeConfig | undefined {
    return this.cache.get(id);
  }

  /**
   * Validate weights sum to 100
   */
  validateScoring(config: ChallengeConfig): boolean {
    const totalWeight = config.scoring.dimensions.reduce(
      (sum, dim) => sum + dim.weight,
      0
    );
    return totalWeight === 100;
  }

  /**
   * Clear cache (for admin/hot reload)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const challengeLoader = new ChallengeLoader();
