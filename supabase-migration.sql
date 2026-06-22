-- ============================================================
-- CipherNest Supabase SQL Migration
-- Run this in your Supabase SQL Editor.
-- Creates tables, functions, trigger, and RLS policies.
-- ============================================================

-- 1. Helper: compute_level (mirrors src/lib/supabase/progress.ts)
CREATE OR REPLACE FUNCTION compute_level(xp int)
RETURNS int
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF xp >= 10000 THEN RETURN 5; END IF;
  IF xp >= 5000  THEN RETURN 4; END IF;
  IF xp >= 2000  THEN RETURN 3; END IF;
  IF xp >= 500   THEN RETURN 2; END IF;
  RETURN 1;
END;
$$;

-- 2. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz DEFAULT now()
);

-- 3. user_progress
CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_week int DEFAULT 1,
  total_xp int DEFAULT 0,
  level int DEFAULT 1,
  streak int DEFAULT 0,
  last_login_date date DEFAULT CURRENT_DATE
);

-- 4. completed_items
CREATE TABLE IF NOT EXISTS completed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type text NOT NULL,
  item_id text NOT NULL,
  xp_earned int DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

-- 5. user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  awarded_at timestamptz DEFAULT now()
);

-- 6. Trigger function: handle_new_user
--    Reads username from auth.users.raw_user_meta_data
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_progress (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- 7. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 8. RPC: increment_xp (used by awardBadge in progress.ts)
CREATE OR REPLACE FUNCTION increment_xp(amount int, uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE user_progress
  SET
    total_xp = total_xp + amount,
    level    = compute_level(total_xp + amount)
  WHERE user_id = uid;
END;
$$;

-- 9. Enable Row-Level Security
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges    ENABLE ROW LEVEL SECURITY;

-- 10. RLS policies (DROP first so it's safe to re-run)

-- profiles: users can read/insert/update their own
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_progress: users can read/insert/update their own
DROP POLICY IF EXISTS "user_progress_select_own" ON user_progress;
CREATE POLICY "user_progress_select_own"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_insert_own" ON user_progress;
CREATE POLICY "user_progress_insert_own"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_update_own" ON user_progress;
CREATE POLICY "user_progress_update_own"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- completed_items: users can read/insert their own
DROP POLICY IF EXISTS "completed_items_select_own" ON completed_items;
CREATE POLICY "completed_items_select_own"
  ON completed_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "completed_items_insert_own" ON completed_items;
CREATE POLICY "completed_items_insert_own"
  ON completed_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_badges: users can read/insert their own
DROP POLICY IF EXISTS "user_badges_select_own" ON user_badges;
CREATE POLICY "user_badges_select_own"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_badges_insert_own" ON user_badges;
CREATE POLICY "user_badges_insert_own"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Done.
