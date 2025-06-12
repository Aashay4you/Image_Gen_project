
-- Update the default credits for new users
ALTER TABLE public.profiles 
ALTER COLUMN credits SET DEFAULT 3;

-- Update existing users to have 3 credits
UPDATE public.profiles SET credits = 3;
