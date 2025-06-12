
-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN credits INTEGER DEFAULT 3 NOT NULL;

-- Update existing users to have 3 credits
UPDATE public.profiles SET credits = 3 WHERE credits IS NULL;
