"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface SkillRadarProps {
  skills: Record<string, number>;
}

const skillLabels: Record<string, string> = {
  clarity: "Clarity",
  context: "Context",
  structure: "Structure",
  efficiency: "Efficiency",
  completeness: "Completeness",
  tone: "Tone",
  actionability: "Actionability",
  "meta-design": "Meta-Design",
  "context-gathering": "Gathering",
  principles: "Principles",
  perspective: "Perspective",
  frameworks: "Frameworks",
};

export function SkillRadar({ skills }: SkillRadarProps) {
  const data = Object.entries(skills).map(([key, value]) => ({
    skill: skillLabels[key] || key,
    score: value,
    fullMark: 100,
  }));

  if (data.length === 0) return null;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
