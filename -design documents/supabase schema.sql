

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, displayname, metadata, createdAt)
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


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
      createdAt
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
$$;


ALTER FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") IS 'To manually link a user profile after creating the user through Supabase Auth:
1. Create user with email joe@derivativegenius.com through Supabase Dashboard or API
2. Get the user UUID from the auth.users table
3. Call: SELECT link_company_admin_profile(''user-uuid-here'');';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."analytics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "period" "text" NOT NULL,
    "metrics" "jsonb" NOT NULL,
    "engagement" "jsonb",
    "demographics" "jsonb",
    "trends" "jsonb",
    "timestamp" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "public"."analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "representative_id" "uuid",
    "constituent_id" "uuid",
    "message_type" "text" NOT NULL,
    "content" "text" NOT NULL,
    "channel" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "sent_at" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."communications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."constituents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text",
    "full_name" "text" NOT NULL,
    "district" "text",
    "preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."constituents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "group_id" "uuid" NOT NULL,
    "constituent_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text",
    "joined_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "settings" "jsonb",
    "metadata" "jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone,
    "representative_id" "uuid",
    "analytics" "jsonb"
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" NOT NULL,
    "displayname" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."representatives" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "district" "text",
    "office_type" "text",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."representatives" OWNER TO "postgres";


ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."constituents"
    ADD CONSTRAINT "constituents_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."constituents"
    ADD CONSTRAINT "constituents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "constituent_id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."representatives"
    ADD CONSTRAINT "representatives_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."representatives"
    ADD CONSTRAINT "representatives_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_communications_sent_at" ON "public"."communications" USING "btree" ("sent_at");



CREATE INDEX "idx_communications_status" ON "public"."communications" USING "btree" ("status");



CREATE INDEX "idx_constituents_email" ON "public"."constituents" USING "btree" ("email");



CREATE INDEX "idx_representatives_email" ON "public"."representatives" USING "btree" ("email");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_constituent_id_fkey" FOREIGN KEY ("constituent_id") REFERENCES "public"."constituents"("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_representative_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_constituent_id_fkey" FOREIGN KEY ("constituent_id") REFERENCES "public"."constituents"("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_representative_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "public"."representatives"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



CREATE POLICY "Constituents can update own data" ON "public"."constituents" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Constituents can view own data" ON "public"."constituents" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Constituents can view their communications" ON "public"."communications" FOR SELECT USING (("auth"."uid"() = "constituent_id"));



CREATE POLICY "Representatives can add group members" ON "public"."group_members" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."id" = "group_members"."group_id") AND ("groups"."representative_id" = "auth"."uid"())))));



CREATE POLICY "Representatives can create communications" ON "public"."communications" FOR INSERT WITH CHECK (("auth"."uid"() = "representative_id"));



CREATE POLICY "Representatives can create groups" ON "public"."groups" FOR INSERT WITH CHECK (("representative_id" = "auth"."uid"()));



CREATE POLICY "Representatives can update own data" ON "public"."representatives" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Representatives can update own groups" ON "public"."groups" FOR UPDATE USING (("representative_id" = "auth"."uid"()));



CREATE POLICY "Representatives can view analytics" ON "public"."analytics" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."representatives"
  WHERE ("representatives"."id" = "auth"."uid"()))));



CREATE POLICY "Representatives can view group members" ON "public"."group_members" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."id" = "group_members"."group_id") AND ("groups"."representative_id" = "auth"."uid"())))));



CREATE POLICY "Representatives can view own data" ON "public"."representatives" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Representatives can view own groups" ON "public"."groups" FOR SELECT USING (("representative_id" = "auth"."uid"()));



CREATE POLICY "Representatives can view related communications" ON "public"."communications" FOR SELECT USING (("auth"."uid"() = "representative_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."communications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."constituents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."representatives" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."link_company_admin_profile"("user_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."analytics" TO "anon";
GRANT ALL ON TABLE "public"."analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics" TO "service_role";



GRANT ALL ON TABLE "public"."communications" TO "anon";
GRANT ALL ON TABLE "public"."communications" TO "authenticated";
GRANT ALL ON TABLE "public"."communications" TO "service_role";



GRANT ALL ON TABLE "public"."constituents" TO "anon";
GRANT ALL ON TABLE "public"."constituents" TO "authenticated";
GRANT ALL ON TABLE "public"."constituents" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."representatives" TO "anon";
GRANT ALL ON TABLE "public"."representatives" TO "authenticated";
GRANT ALL ON TABLE "public"."representatives" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
