-- Migration: 20250303080400_add_admin_user.sql
-- Create function to link company admin user profile
-- Created on: 2025-03-03 08:04:00 UTC

-- NOTE: This migration does not create the actual auth user.
-- You must create the user through Supabase Auth API or Dashboard first:
-- Email: joe@derivativegenius.com
-- Password: roth1his5#$
-- Then use the user's UUID to link the profile.

-- Create a function to link a user ID to a company admin profile
CREATE OR REPLACE FUNCTION public.link_company_admin_profile(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    -- Insert into profiles table
    INSERT INTO profiles (
      id,
      email,
      role,
      displayName,
      metadata,
      created_at
    ) VALUES (
      user_id,
      'joe@derivativegenius.com',
      'company_admin',
      'Joe Terry',
      '{"firstName": "Joe", "lastName": "Terry", "employmentType": "permanent"}',
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to automatically link new users with the specified email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'joe@derivativegenius.com' THEN
    -- Link the company admin profile
    PERFORM link_company_admin_profile(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on auth.users to automatically link profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Instructions for manual user creation:
COMMENT ON FUNCTION public.link_company_admin_profile(UUID) IS 
'To manually link a user profile after creating the user through Supabase Auth:
1. Create user with email joe@derivativegenius.com through Supabase Dashboard or API
2. Get the user UUID from the auth.users table
3. Call: SELECT link_company_admin_profile(''user-uuid-here'');';
