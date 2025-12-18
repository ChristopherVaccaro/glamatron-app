-- Glamatron Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'test', 'user')),
  glam_coins INTEGER NOT NULL DEFAULT 5,
  is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  has_purchased BOOLEAN NOT NULL DEFAULT FALSE, -- Unlocks full style library after first purchase
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generation history table
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  original_image_url TEXT,
  generated_image_url TEXT,
  selections JSONB NOT NULL DEFAULT '{}',
  coins_used INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table for coin purchases
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'bonus', 'subscription', 'refund', 'admin_grant')),
  coins_amount INTEGER NOT NULL,
  price_cents INTEGER, -- NULL for bonuses/grants
  currency TEXT DEFAULT 'USD',
  stripe_payment_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update/delete their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Generations: Users can only see their own generations
CREATE POLICY "Users can view own generations" ON public.generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  initial_coins INTEGER;
  is_sub BOOLEAN;
BEGIN
  -- Determine role based on email
  IF NEW.email = 'admin@glamatron.app' THEN
    user_role := 'admin';
    initial_coins := 9999;
    is_sub := TRUE;
  ELSIF NEW.email = 'testuser@glamatron.app' THEN
    user_role := 'test';
    initial_coins := 5;
    is_sub := FALSE;
  ELSE
    user_role := 'user';
    initial_coins := 5;
    is_sub := FALSE;
  END IF;

  INSERT INTO public.profiles (id, email, name, role, glam_coins, is_subscribed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    user_role,
    initial_coins,
    is_sub
  );
  
  -- Log the signup bonus transaction
  INSERT INTO public.transactions (user_id, type, coins_amount, description)
  VALUES (NEW.id, 'bonus', initial_coins, 'Welcome bonus coins');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to deduct coins (returns detailed result with new balance)
CREATE OR REPLACE FUNCTION public.deduct_coin(user_uuid UUID)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, message TEXT) AS $$
DECLARE
  current_coins INTEGER;
  is_sub BOOLEAN;
  user_role TEXT;
BEGIN
  SELECT glam_coins, is_subscribed, role INTO current_coins, is_sub, user_role
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- User not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found'::TEXT;
    RETURN;
  END IF;
  
  -- Admin and subscribed users don't lose coins
  IF user_role = 'admin' OR is_sub THEN
    RETURN QUERY SELECT TRUE, current_coins, 'Unlimited access'::TEXT;
    RETURN;
  END IF;
  
  -- Check if user has coins
  IF current_coins <= 0 THEN
    RETURN QUERY SELECT FALSE, 0, 'Insufficient coins'::TEXT;
    RETURN;
  END IF;
  
  -- Deduct coin
  UPDATE public.profiles
  SET glam_coins = glam_coins - 1, updated_at = NOW()
  WHERE id = user_uuid
  RETURNING glam_coins INTO current_coins;
  
  -- Log the transaction
  INSERT INTO public.transactions (user_id, type, coins_amount, description)
  VALUES (user_uuid, 'purchase', -1, 'Generation cost');
  
  RETURN QUERY SELECT TRUE, current_coins, 'Coin deducted'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add coins (for purchases) - returns detailed result
CREATE OR REPLACE FUNCTION public.add_coins(user_uuid UUID, amount INTEGER, transaction_type TEXT DEFAULT 'purchase', trans_description TEXT DEFAULT 'Coin purchase')
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, message TEXT) AS $$
DECLARE
  current_coins INTEGER;
BEGIN
  -- Validate amount
  IF amount <= 0 THEN
    RETURN QUERY SELECT FALSE, 0, 'Invalid amount'::TEXT;
    RETURN;
  END IF;

  -- Update coins
  UPDATE public.profiles
  SET glam_coins = glam_coins + amount, updated_at = NOW()
  WHERE id = user_uuid
  RETURNING glam_coins INTO current_coins;
  
  -- User not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found'::TEXT;
    RETURN;
  END IF;
  
  -- Log the transaction
  INSERT INTO public.transactions (user_id, type, coins_amount, description)
  VALUES (user_uuid, transaction_type, amount, trans_description);
  
  RETURN QUERY SELECT TRUE, current_coins, 'Coins added'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile
CREATE OR REPLACE FUNCTION public.get_profile(user_uuid UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  role TEXT,
  glam_coins INTEGER,
  is_subscribed BOOLEAN,
  has_purchased BOOLEAN,
  subscription_tier TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.name,
    p.avatar_url,
    p.role,
    p.glam_coins,
    p.is_subscribed,
    p.has_purchased,
    p.subscription_tier,
    p.subscription_expires_at,
    p.created_at
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION public.update_subscription(user_uuid UUID, subscribed BOOLEAN, bonus_coins INTEGER DEFAULT 0)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, is_now_subscribed BOOLEAN) AS $$
DECLARE
  current_coins INTEGER;
BEGIN
  UPDATE public.profiles
  SET 
    is_subscribed = subscribed,
    subscription_tier = CASE WHEN subscribed THEN 'pro' ELSE 'free' END,
    glam_coins = glam_coins + bonus_coins,
    updated_at = NOW()
  WHERE id = user_uuid
  RETURNING glam_coins INTO current_coins;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, FALSE;
    RETURN;
  END IF;
  
  -- Log subscription transaction if bonus coins given
  IF bonus_coins > 0 THEN
    INSERT INTO public.transactions (user_id, type, coins_amount, description)
    VALUES (user_uuid, 'subscription', bonus_coins, 'Subscription bonus coins');
  END IF;
  
  RETURN QUERY SELECT TRUE, current_coins, subscribed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log a generation
CREATE OR REPLACE FUNCTION public.log_generation(
  user_uuid UUID,
  selections_data JSONB,
  gen_status TEXT DEFAULT 'completed',
  error_msg TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.generations (user_id, selections, status, error_message)
  VALUES (user_uuid, selections_data, gen_status, error_msg)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.generations IS 'History of AI image generations';
COMMENT ON TABLE public.transactions IS 'Coin purchase and bonus transactions';
COMMENT ON TABLE public.subscriptions IS 'User subscription details';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin, test, or user';
COMMENT ON COLUMN public.profiles.glam_coins IS 'Current coin balance for generations';

-- =====================================================
-- STORAGE BUCKET FOR GALLERY IMAGES
-- =====================================================
-- IMPORTANT: Create the storage bucket manually in Supabase Dashboard:
-- 1. Go to Storage → New bucket → Name: "gallery-images" → Set to Public → Create
-- 2. Then add these policies via Dashboard (Storage → gallery-images → Policies → New Policy):
--
-- Policy 1 - INSERT (uploads):
--   Name: "Users can upload own images"
--   Operation: INSERT
--   Policy: (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1])
--
-- Policy 2 - SELECT (view):
--   Name: "Users can view own images"  
--   Operation: SELECT
--   Policy: (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1])
--
-- Policy 3 - DELETE:
--   Name: "Users can delete own images"
--   Operation: DELETE
--   Policy: (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1])
--
-- OR for simpler setup, just enable "Public bucket" and add a single SELECT policy:
--   Policy: true (allows anyone to view uploaded images via URL)

-- =====================================================
-- GALLERY TABLE (replaces localStorage)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  original_image_url TEXT NOT NULL,
  result_image_url TEXT NOT NULL,
  selections JSONB NOT NULL DEFAULT '{}',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Gallery policies
CREATE POLICY "Users can view own gallery items" ON public.gallery_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gallery items" ON public.gallery_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gallery items" ON public.gallery_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gallery items" ON public.gallery_items
  FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_user_id ON public.gallery_items(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON public.gallery_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_favorite ON public.gallery_items(user_id, is_favorite) WHERE is_favorite = TRUE;

COMMENT ON TABLE public.gallery_items IS 'User gallery of generated images';

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================
-- Enable realtime for profiles table (for live coin balance updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
