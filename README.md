# Prompt Golf ⛳

> VimGolf for AI Prompting — A gamified prompt engineering training platform for enterprise executives.

Write the most effective prompts for real business scenarios. Get scored by an AI judge. Climb the leaderboard. Level up your team.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Anthropic API key to .env.local
# ANTHROPIC_API_KEY=sk-ant-xxxxx

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing.

## Features

- **10 Challenge Scenarios** across 8 categories (summarization, communication, analysis, strategy, and more)
- **AI-Powered Scoring** with detailed feedback across 5 scoring dimensions
- **Streaming Score Display** with animated results
- **Time Bonus System** for beating par time
- **Leaderboard** with rankings and streaks
- **16 Achievements** from Common to Legendary rarity
- **Progress Dashboard** with skill radar chart
- **Admin Dashboard** with challenge manager and analytics
- **Mobile Responsive** design
- **Onboarding Flow** for first-time users
- **Enterprise-Ready** with multi-tenancy and Supabase integration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| AI | Vercel AI SDK + Anthropic Claude |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Charts | Recharts |
| Validation | Zod |
| Deployment | Vercel |

## Project Structure

```
prompt-golf/
├── app/                    # Next.js App Router pages
│   ├── challenges/         # Challenge list and detail pages
│   ├── leaderboard/        # Leaderboard page
│   ├── progress/           # Progress dashboard
│   ├── login/              # Authentication page
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── challenges/             # YAML challenge configurations
├── components/             # React components
│   ├── challenges/         # Challenge UI components
│   ├── prompt-input/       # Prompt editor
│   ├── scoring/            # Score display components
│   ├── leaderboard/        # Leaderboard components
│   ├── progression/        # Progress & achievements
│   ├── shared/             # Shared components
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Core libraries
│   ├── challenges/         # Challenge types, loader, registry
│   ├── scoring/            # Judge prompt generator, scoring service
│   ├── achievements/       # Achievement config and checker
│   ├── supabase/           # Supabase client setup
│   └── tenant/             # Multi-tenancy context
└── supabase/
    └── migrations/         # Database migration files
```

## Challenge System

Challenges are defined as YAML files in the `/challenges` directory. Each challenge includes:

- **Scenario**: Business context with constraints and persona
- **Success Criteria**: What good looks like, must-include/must-avoid
- **Educational Content**: Skills taught, bad/good/expert examples
- **Scoring Config**: Dimensions with rubrics, thresholds, and judge settings
- **Progression**: Prerequisites, next challenges, retry behavior

### Creating a New Challenge

1. Copy `challenges/01-clear-request.yaml` as a template
2. Fill in your scenario, criteria, and scoring config
3. Ensure scoring dimension weights sum to 100
4. Place the file in `/challenges/`
5. The challenge appears automatically on reload

## Scoring Dimensions

Each prompt is evaluated across multiple dimensions:

| Dimension | Description |
|-----------|-------------|
| **Clarity** | How specific and unambiguous is the request? |
| **Context** | Did you provide enough background? |
| **Structure** | Is the output format clearly defined? |
| **Efficiency** | Is the prompt appropriately concise? |
| **Completeness** | Does it address all aspects of the task? |

Some challenges have additional dimensions like **Tone**, **Actionability**, **Frameworks**, or **Meta-Design**.

## Connecting Supabase (Optional)

The app works fully in local mode (localStorage). To enable multi-user features:

1. Create a [Supabase project](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Add your Supabase credentials to `.env.local`
4. Auth, leaderboards, and progress sync will activate automatically

## Deployment

```bash
# Deploy to Vercel
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

Required environment variables on Vercel:
- `ANTHROPIC_API_KEY` (required for scoring)
- `NEXT_PUBLIC_SUPABASE_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)

## License

MIT
