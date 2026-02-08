-- Prompt Golf: Initial Database Schema
-- Run this migration when connecting Supabase

-- Tenants (for enterprise multi-tenancy)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'learner', -- 'learner', 'admin', 'super_admin'
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge attempts
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  challenge_id TEXT NOT NULL,
  challenge_version TEXT NOT NULL,
  
  -- The actual prompt submitted
  prompt TEXT NOT NULL,
  
  -- Timing
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  elapsed_seconds INTEGER NOT NULL,
  
  -- Scoring
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  time_bonus INTEGER DEFAULT 0,
  final_score INTEGER NOT NULL,
  dimension_scores JSONB NOT NULL,
  overall_feedback JSONB NOT NULL,
  quality_level TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON attempts(user_id);
CREATE INDEX idx_attempts_challenge ON attempts(challenge_id);
CREATE INDEX idx_attempts_score ON attempts(final_score DESC);

-- User progress (denormalized for fast reads)
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  
  -- Completed challenges with best scores
  completed_challenges JSONB DEFAULT '{}',
  
  -- Aggregates
  total_challenges_completed INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  
  -- Skill breakdown
  skill_scores JSONB DEFAULT '{}',
  
  -- Streak tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard materialized view (refreshed periodically)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id AS user_id,
  u.display_name,
  u.avatar_url,
  u.tenant_id,
  up.total_points,
  up.total_challenges_completed,
  up.average_score,
  up.current_streak,
  RANK() OVER (ORDER BY up.total_points DESC) AS global_rank,
  RANK() OVER (PARTITION BY u.tenant_id ORDER BY up.total_points DESC) AS tenant_rank
FROM users u
JOIN user_progress up ON u.id = up.user_id
WHERE up.total_challenges_completed > 0;

CREATE UNIQUE INDEX idx_leaderboard_user ON leaderboard(user_id);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh on progress update
CREATE TRIGGER trigger_refresh_leaderboard
AFTER INSERT OR UPDATE ON user_progress
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard();

-- Achievements/badges
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common'
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id),
  achievement_id TEXT REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY attempts_own_data ON attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY progress_own_data ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY achievements_own_data ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY analytics_own_data ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can see tenant data
CREATE POLICY admin_tenant_users ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'super_admin')
      AND u.tenant_id = users.tenant_id
    )
  );

CREATE POLICY admin_tenant_attempts ON attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN users target ON target.id = attempts.user_id
      WHERE u.id = auth.uid() 
      AND u.role IN ('admin', 'super_admin')
      AND u.tenant_id = target.tenant_id
    )
  );

-- Public leaderboard read (no RLS on materialized view)

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
