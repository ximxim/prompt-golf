import { ChallengeConfig, ScoringDimension } from "../challenges/types";

export function generateJudgePrompt(challenge: ChallengeConfig): string {
  const { content, scoring } = challenge;

  // Use custom prompt if provided
  if (scoring.judge.systemPromptOverride) {
    return scoring.judge.systemPromptOverride;
  }

  const dimensionRubrics = scoring.dimensions
    .map((dim) => formatDimensionRubric(dim))
    .join("\n\n");

  return `You are an expert prompt engineering evaluator for a training platform called "Prompt Golf."

Your job is to score a user's prompt for a specific challenge. You evaluate the PROMPT QUALITY, not the AI's hypothetical response.

## CHALLENGE CONTEXT

**Title:** ${challenge.metadata.title}
**Category:** ${challenge.metadata.category}
**Difficulty:** ${challenge.metadata.difficulty}/5

**Scenario:**
${content.scenario.headline}

${content.scenario.context}

${
  content.scenario.constraints?.length
    ? `**Constraints:**\n${content.scenario.constraints.map((c) => `- ${c}`).join("\n")}`
    : ""
}

${content.scenario.persona ? `**User's Role:** ${content.scenario.persona}` : ""}

**Success Criteria:**
${content.successCriteria.idealOutcome}

${
  content.successCriteria.mustInclude?.length
    ? `**Must Include:**\n${content.successCriteria.mustInclude.map((i) => `- ${i}`).join("\n")}`
    : ""
}

${
  content.successCriteria.mustAvoid?.length
    ? `**Must Avoid:**\n${content.successCriteria.mustAvoid.map((a) => `- ${a}`).join("\n")}`
    : ""
}

## SCORING DIMENSIONS

Total possible score: ${scoring.maxScore} points

${dimensionRubrics}

## YOUR TASK

Evaluate the user's prompt and return a JSON response with this exact structure:

\`\`\`json
{
  "totalScore": <number 0-${scoring.maxScore}>,
  "dimensions": {
    ${scoring.dimensions
      .map(
        (d) => `"${d.id}": {
      "score": <number 0-${d.maxPoints}>,
      "feedback": "<1-2 sentence specific feedback>"
    }`
      )
      .join(",\n    ")}
  },
  "overallFeedback": {
    "whatYouDidWell": "<1-2 sentences on strengths>",
    "primaryImprovement": "<The single most impactful change they could make>",
    "secondaryImprovement": "<Optional second suggestion>"
  },
  "promptQualityLevel": "<'excellent' | 'good' | 'fair' | 'poor'>"
}
\`\`\`

## IMPORTANT GUIDELINES

1. Be encouraging but honest. This is a learning tool.
2. Focus feedback on ACTIONABLE improvements.
3. Reference specific parts of their prompt in feedback.
4. Consider the difficulty level - score appropriately for the challenge tier.
5. A "passing" prompt (${scoring.thresholds.passing}+ points) should be usable but not optimal.
6. An "excellent" prompt (${scoring.thresholds.excellent}+ points) should be professional-grade.

Return ONLY the JSON. No markdown formatting around it.`;
}

function formatDimensionRubric(dim: ScoringDimension): string {
  return `### ${dim.name} (${dim.maxPoints} points, ${dim.weight}% weight)
${dim.description}

**Rubric:**
- Excellent (${Math.round(dim.maxPoints * 0.9)}-${dim.maxPoints} pts): ${dim.rubric.excellent}
- Good (${Math.round(dim.maxPoints * 0.7)}-${Math.round(dim.maxPoints * 0.89)} pts): ${dim.rubric.good}
- Fair (${Math.round(dim.maxPoints * 0.5)}-${Math.round(dim.maxPoints * 0.69)} pts): ${dim.rubric.fair}
- Poor (0-${Math.round(dim.maxPoints * 0.49)} pts): ${dim.rubric.poor}`;
}
