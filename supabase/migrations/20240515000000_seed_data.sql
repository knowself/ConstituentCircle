-- Create necessary tables first
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  displayname TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.representatives (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  district TEXT,
  office_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.constituents (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  district TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  representative_id UUID REFERENCES public.representatives(id)
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID REFERENCES public.groups(id),
  constituent_id UUID REFERENCES public.constituents(id),
  role TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (group_id, constituent_id)
);

CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY,
  representative_id UUID REFERENCES public.representatives(id),
  constituent_id UUID REFERENCES public.constituents(id),
  message_type TEXT,
  content TEXT,
  channel TEXT,
  status TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY,
  period TEXT,
  metrics JSONB DEFAULT '{}'::jsonb,
  engagement JSONB DEFAULT '{}'::jsonb,
  demographics JSONB DEFAULT '{}'::jsonb,
  trends JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, displayname, metadata, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'constituent',  -- Default role
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    jsonb_build_object('firstName', split_part(COALESCE(NEW.raw_user_meta_data->>'name', ''), ' ', 1), 'lastName', split_part(COALESCE(NEW.raw_user_meta_data->>'name', ''), ' ', 2)),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Then create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now proceed with the rest of your migration (data insertion)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'joe@derivativegenius.com', 
   crypt('adminpassword', gen_salt('bf')), now(), now(), now(),
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Admin User"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'rep@constituentcircle.com', 
   crypt('reppassword', gen_salt('bf')), now(), now(), now(),
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Jane Smith"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'constituent@example.com', 
   crypt('constpassword', gen_salt('bf')), now(), now(), now(),
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "John Doe"}')
ON CONFLICT (id) DO NOTHING;

-- Then create all profiles
INSERT INTO public.profiles (id, email, role, displayname, metadata, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'joe@derivativegenius.com', 
   'company_admin', 'Admin User', 
   '{"firstName": "Admin", "lastName": "User", "employmentType": "permanent"}', 
   now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role, displayname, metadata, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'rep@constituentcircle.com', 
   'representative', 'Jane Smith', 
   '{"firstName": "Jane", "lastName": "Smith", "employmentType": "elected"}', 
   now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, role, displayname, metadata, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'constituent@example.com', 
   'constituent', 'John Doe', 
   '{"firstName": "John", "lastName": "Doe", "employmentType": "citizen"}', 
   now())
ON CONFLICT (id) DO NOTHING;

-- Create representative record BEFORE communications that reference it
INSERT INTO public.representatives (id, email, full_name, district, office_type, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'rep@constituentcircle.com', 
   'Jane Smith', 'District 5', 'State Representative', now())
ON CONFLICT (id) DO NOTHING;

-- Create constituent record
INSERT INTO public.constituents (id, email, full_name, district, preferences, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'constituent@example.com', 
   'John Doe', 'District 5', 
   '{"contact_preference": "email", "interests": ["education", "healthcare"]}', 
   now())
ON CONFLICT (id) DO NOTHING;

-- Create groups
INSERT INTO public.groups (id, name, description, type, settings, metadata, created_at, representative_id)
VALUES 
  ('00000000-0000-0000-0000-000000000010', 'Education Committee', 
   'Group focused on education policy', 'committee', 
   '{"visibility": "public"}', 
   '{"priority": "high", "meeting_schedule": "monthly"}', 
   now(), '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000011', 'Healthcare Advocates', 
   'Citizens interested in healthcare reform', 'interest', 
   '{"visibility": "public"}', 
   '{"priority": "medium", "meeting_schedule": "quarterly"}', 
   now(), '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Add group members
INSERT INTO public.group_members (group_id, constituent_id, role, joined_at)
VALUES 
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 
   'member', now()),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 
   'coordinator', now())
ON CONFLICT (group_id, constituent_id) DO NOTHING;

-- Add a delay to ensure previous inserts are committed
SELECT pg_sleep(1);

-- Create communications AFTER representatives and constituents
INSERT INTO public.communications (id, representative_id, constituent_id, message_type, content, channel, status, sent_at, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000003', 'newsletter', 
   'Monthly update on district activities and upcoming town halls', 'email', 
   'sent', now() - interval '5 days', now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000003', 'response', 
   'Thank you for your inquiry about the new education bill. I appreciate your feedback.', 
   'email', 'sent', now() - interval '2 days', now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000003', 'inquiry', 
   'I would like to know your position on the upcoming healthcare vote.', 
   'web', 'received', now() - interval '1 day', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Create analytics data
INSERT INTO public.analytics (id, period, metrics, engagement, demographics, trends, timestamp, metadata)
VALUES 
  ('00000000-0000-0000-0000-000000000030', 'monthly', 
   '{"messages_sent": 45, "response_rate": 0.87, "avg_response_time": "8h"}',
   '{"open_rate": 0.65, "click_rate": 0.22, "unsubscribe_rate": 0.01}',
   '{"age_groups": {"18-24": 0.15, "25-34": 0.25, "35-44": 0.30, "45-54": 0.20, "55+": 0.10}, 
     "locations": {"urban": 0.45, "suburban": 0.40, "rural": 0.15}}',
   '{"increasing_topics": ["education", "healthcare"], "decreasing_topics": ["taxes"]}',
   now() - interval '1 month', 
   '{"source": "system_generated", "version": "1.0"}')
ON CONFLICT (id) DO NOTHING;