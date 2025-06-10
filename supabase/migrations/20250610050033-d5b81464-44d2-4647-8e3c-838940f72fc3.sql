
-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN credits INTEGER DEFAULT 10 NOT NULL;

-- Update existing users to have 10 credits
UPDATE public.profiles SET credits = 10 WHERE credits IS NULL;
