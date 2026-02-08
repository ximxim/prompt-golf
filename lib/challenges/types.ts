/**
 * Core challenge configuration schema
 * All challenges are instances of this type
 */
export interface ChallengeConfig {
  // Identity
  id: string;
  version: string;

  // Metadata
  metadata: ChallengeMetadata;

  // Content
  content: ChallengeContent;

  // Scoring
  scoring: ScoringConfig;

  // Progression
  progression: ProgressionConfig;

  // Feature flags
  flags?: ChallengeFlags;
}

export interface ChallengeMetadata {
  title: string;
  shortDescription: string;
  category: ChallengeCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  tags: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export type ChallengeCategory =
  | "summarization"
  | "communication"
  | "analysis"
  | "documentation"
  | "strategy"
  | "automation"
  | "planning"
  | "roleplay"
  | "meta-prompting";

export interface ChallengeContent {
  scenario: {
    headline: string;
    context: string;
    constraints?: string[];
    persona?: string;
  };

  successCriteria: {
    idealOutcome: string;
    mustInclude?: string[];
    mustAvoid?: string[];
  };

  educational: {
    skillsTaught: string[];
    conceptExplanation?: string;
    badExample: PromptExample;
    goodExample: PromptExample;
    expertExample?: PromptExample;
  };

  seedData?: {
    type: "text" | "table" | "json" | "image-url";
    content: string;
    description: string;
  };
}

export interface PromptExample {
  prompt: string;
  score?: number;
  explanation: string;
}

export interface ScoringConfig {
  maxScore: number;
  timeBonus?: {
    enabled: boolean;
    maxBonusPercent: number;
    parTimeSeconds: number;
  };

  dimensions: ScoringDimension[];

  judge: {
    model: "claude-sonnet-4-20250514" | "gpt-4o" | "claude-opus-4-20250514";
    temperature: number;
    systemPromptOverride?: string;
  };

  thresholds: {
    excellent: number;
    good: number;
    passing: number;
  };
}

export interface ScoringDimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxPoints: number;

  rubric: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}

export interface ProgressionConfig {
  prerequisites?: string[];
  unlockScore?: number;
  nextChallenges?: string[];

  retries: {
    unlimited: boolean;
    maxAttempts?: number;
    cooldownSeconds?: number;
  };
}

export interface ChallengeFlags {
  isActive: boolean;
  isFeatured: boolean;
  isExperimental: boolean;
  allowedTenants?: string[];
  startDate?: string;
  endDate?: string;
}
