-- Migration: Create user_favorite_style_options table
-- Run this in the Supabase SQL Editor or via CLI

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.user_favorite_style_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  style_option_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_favorite_style_options_unique UNIQUE (user_id, style_option_id)
);

-- 2. Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_favorite_style_options_user_id
  ON public.user_favorite_style_options (user_id);

-- 3. Enable Row Level Security
ALTER TABLE public.user_favorite_style_options ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: users can only access their own favorites
CREATE POLICY "Users can view their own favorite style options"
  ON public.user_favorite_style_options
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own favorite style options"
  ON public.user_favorite_style_options
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorite style options"
  ON public.user_favorite_style_options
  FOR DELETE
  USING (user_id = auth.uid());
