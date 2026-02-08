# Changelog

All notable changes to Prompt Golf will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-07

### Added

#### Core Platform
- Next.js 16 App Router project with TypeScript, Tailwind CSS v4, and shadcn/ui
- Dark mode theme (slate-900 base) across all pages
- Global navigation with links to Challenges, Leaderboard, and Progress
- Landing page with hero section, how-it-works, featured challenges, and stats
- Custom 404 and error boundary pages
- Middleware for session management and route protection

#### Challenge System
- YAML-based challenge configuration with Zod runtime validation
- `ChallengeConfig` TypeScript type system covering metadata, content, scoring, progression, and feature flags
- `ChallengeLoader` class with filesystem loading, parsing, caching, and weight validation
- `ChallengeRegistry` singleton with filtering by category/difficulty/tags, progression logic, and hot reload support
- 10 challenge scenarios across 8 categories and 5 difficulty levels:
  - **Warm-up (1):** The Clear Request, The Professional Email, The Data Interpreter
  - **Beginner (2):** The Meeting Architect, The Stakeholder Update
  - **Intermediate (3):** The Process Automator, The Crisis Communicator
  - **Advanced (4):** The Strategy Document, The Negotiation Prep
  - **Expert (5):** The Meta-Prompt Builder

#### Scoring Engine
- Dynamic LLM judge prompt generator built from challenge config (rubrics, dimensions, thresholds)
- `ScoringService` class with model selection (Claude Sonnet/Opus, GPT-4o) and time bonus calculation
- Streaming score API route using Vercel AI SDK `streamObject` with Zod schema
- Scoring across 5 core dimensions: Clarity, Context, Structure, Efficiency, Completeness
- Challenge-specific dimensions: Tone, Actionability, Frameworks, Meta-Design, Perspective

#### UI Components
- Split-screen challenge page (scenario left, prompt editor right)
- `ChallengeScenario` component with collapsible examples (bad/good/expert), constraints, success criteria, seed data
- `PromptEditor` with character count hints, timer integration, hint toggle, and submit flow
- `ScoreDisplay` with animated score counter, progress bar, and quality level badge
- `ScoreDimensions` with color-coded progress bars per dimension and per-dimension feedback
- `ScoreFeedback` with "what you did well", "top improvement", and "also consider" sections
- `ChallengeCard` grid with difficulty badges, category pills, best score indicators, and featured highlights
- `DifficultyBadge` (star-rated, color-coded), `CategoryPill` (icon + label), `Timer` (par time aware)
- Challenge list page with search, category filters, and difficulty filters

#### Gamification
- Leaderboard page with ranked table, user position card, avatar initials, and streak indicators
- 16 achievements across 4 rarity tiers (common/rare/epic/legendary) with automatic unlock checking
- `AchievementBadge` component with tooltip descriptions and rarity-themed styling
- Progress dashboard with stats overview (total points, challenges completed, average score, total attempts)
- Skill radar chart (Recharts) showing performance across scoring dimensions
- Challenge map showing completed/available challenges with best scores

#### Custom Hooks
- `useTimer` — start/stop/reset timer with elapsed seconds tracking
- `useScoring` — manages scoring API call, streaming state, result parsing
- `useChallenge` — fetches and caches challenge config from API
- `useAttempts` — localStorage-based attempt history with best scores and aggregation

#### Onboarding
- 4-step onboarding overlay for first-time users (Welcome, Pick a Challenge, Write Your Prompt, Get Scored)
- Progress dots, skip option, and localStorage dismissal tracking

#### Authentication & Multi-tenancy
- Login page with password and magic link tabs, plus "continue without auth" option
- Supabase SSR client setup (browser client, server client, middleware)
- Route protection middleware for admin pages
- `TenantProvider` context for multi-tenancy with custom branding support

#### Admin Dashboard
- Admin overview page with stats cards and navigation to sub-pages
- Challenge manager with table view (title, category, difficulty, version, status) and YAML editor dialog with validation
- Analytics page with overall stats (total attempts, avg score, passing/excellent rates) and per-challenge performance breakdown
- Team management page with enterprise feature preview

#### Database
- Supabase migration with full schema: `tenants`, `users`, `attempts`, `user_progress`, `achievements`, `user_achievements`, `analytics_events`
- `leaderboard` materialized view with global and tenant rankings, auto-refresh trigger
- Row Level Security policies for user data isolation and admin tenant access
- Auto user profile creation trigger on auth signup

#### API Routes
- `GET /api/challenges` — list all challenges with filtering
- `GET /api/challenges/[id]` — single challenge details
- `POST /api/score` — streaming prompt scoring via AI judge
- `POST /api/attempts` — save attempt (placeholder for Supabase)
- `GET /api/leaderboard` — leaderboard data (placeholder for Supabase)
- `GET /api/progress` — user progress (placeholder for Supabase)
- `POST /api/admin/challenges` — validate challenge YAML
- `GET /api/cron/refresh-leaderboard` — periodic leaderboard refresh
- `GET /api/cron/daily-streaks` — daily streak calculation

#### Infrastructure
- `.env.example` with all required and optional environment variables
- `vercel.json` with cron job schedules (leaderboard every 5 min, streaks daily)
- localStorage-based persistence layer (works without Supabase)
- Comprehensive `README.md` with setup, architecture, and challenge authoring guide
