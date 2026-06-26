-- ============================================================
-- Add consent tracking columns to profiles table
-- Run this in your Supabase SQL Editor.
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS terms_version text;
