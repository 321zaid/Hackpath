-- ============================================================
-- RLS Policies — Verification & Migration
-- ============================================================
-- Tables found in this project that contain user-specific data:
--   1. profiles       (user profiles)
--   2. user_progress  (gamification progress)
--   3. completed_items (tracked completions)
--   4. user_badges    (awarded badges)
--
-- Tables listed in the original request but SKIPPED because
-- they do not exist in this codebase:
--   - leaderboard  (leaderboard is a server-side API querying
--                   user_progress + profiles, not a table)
--   - lessons      (defined in src/data/curriculum.ts, not DB)
--   - quiz_results (handled via completed_items)
--   - badges       (defined in src/data/badges.ts, not DB)
--   - sessions     (handled by Supabase Auth, not a public table)
--
-- RLS STATUS (as of June 2026):
--   ✅ profiles       — RLS already ENABLED, policies exist
--   ✅ user_progress  — RLS already ENABLED, policies exist
--   ✅ completed_items — RLS already ENABLED, policies exist
--   ✅ user_badges    — RLS already ENABLED, policies exist
--   ⚠️ knowledge_chunks — RLS NOT enabled (admin-only RAG table,
--                         no user-specific data; optional)
--
-- The policies below are safe to re-run (DROP IF EXISTS + CREATE).
-- They match the existing policies exactly — included here for
-- reproducibility and as a single-source-of-truth migration.
-- ============================================================

-- 1. Enable RLS (idempotent)
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges    ENABLE ROW LEVEL SECURITY;

-- 2. Profiles: select/insert/update own
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

-- 3. User Progress: select/insert/update own
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

-- 4. Completed Items: select/insert own
DROP POLICY IF EXISTS "completed_items_select_own" ON completed_items;
CREATE POLICY "completed_items_select_own"
  ON completed_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "completed_items_insert_own" ON completed_items;
CREATE POLICY "completed_items_insert_own"
  ON completed_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. User Badges: select/insert own
DROP POLICY IF EXISTS "user_badges_select_own" ON user_badges;
CREATE POLICY "user_badges_select_own"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_badges_insert_own" ON user_badges;
CREATE POLICY "user_badges_insert_own"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Done.
