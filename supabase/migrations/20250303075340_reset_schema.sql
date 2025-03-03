-- Migration: 20250303075340_reset_schema.sql
-- Reset Schema for Constituent Circle Database
-- This file resets and recreates the entire database schema
-- Created on: 2025-03-03 07:53:40 UTC

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS analytics;
DROP TABLE IF EXISTS communications;
DROP TABLE IF EXISTS constituents;
DROP TABLE IF EXISTS representatives;
DROP TABLE IF EXISTS profiles;

-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables for core functionality
CREATE TABLE representatives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  district TEXT,
  office_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE constituents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  district TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  representative_id UUID REFERENCES representatives(id),
  constituent_id UUID REFERENCES constituents(id),
  message_type TEXT NOT NULL,
  content TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create profiles table for user authentication
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  displayName TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analytics table for dashboard metrics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period TEXT NOT NULL,
  metrics JSONB NOT NULL,
  engagement JSONB,
  demographics JSONB,
  trends JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  metadata JSONB
);

-- Create groups table for constituent groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  settings JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  representative_id UUID REFERENCES representatives(id),
  analytics JSONB
);

-- Create group_members junction table
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id),
  constituent_id UUID REFERENCES constituents(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (group_id, constituent_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Add indexes for better query performance
CREATE INDEX idx_representatives_email ON representatives(email);
CREATE INDEX idx_constituents_email ON constituents(email);
CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_communications_sent_at ON communications(sent_at);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Representatives can view own data" ON representatives;
DROP POLICY IF EXISTS "Representatives can update own data" ON representatives;
DROP POLICY IF EXISTS "Constituents can view own data" ON constituents;
DROP POLICY IF EXISTS "Constituents can update own data" ON constituents;
DROP POLICY IF EXISTS "Representatives can view related communications" ON communications;
DROP POLICY IF EXISTS "Constituents can view their communications" ON communications;
DROP POLICY IF EXISTS "Representatives can create communications" ON communications;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Representatives can view analytics" ON analytics;
DROP POLICY IF EXISTS "Representatives can view own groups" ON groups;
DROP POLICY IF EXISTS "Representatives can create groups" ON groups;
DROP POLICY IF EXISTS "Representatives can update own groups" ON groups;
DROP POLICY IF EXISTS "Representatives can view group members" ON group_members;
DROP POLICY IF EXISTS "Representatives can add group members" ON group_members;

-- Create RLS policies
-- Representatives policies
CREATE POLICY "Representatives can view own data"
  ON representatives FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Representatives can update own data"
  ON representatives FOR UPDATE
  USING (auth.uid() = id);

-- Constituents policies
CREATE POLICY "Constituents can view own data"
  ON constituents FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Constituents can update own data"
  ON constituents FOR UPDATE
  USING (auth.uid() = id);

-- Communications policies
CREATE POLICY "Representatives can view related communications"
  ON communications FOR SELECT
  USING (auth.uid() = representative_id);

CREATE POLICY "Constituents can view their communications"
  ON communications FOR SELECT
  USING (auth.uid() = constituent_id);

CREATE POLICY "Representatives can create communications"
  ON communications FOR INSERT
  WITH CHECK (auth.uid() = representative_id);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Analytics policies
CREATE POLICY "Representatives can view analytics"
  ON analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM representatives
    WHERE representatives.id = auth.uid()
  ));

-- Groups policies
CREATE POLICY "Representatives can view own groups"
  ON groups FOR SELECT
  USING (representative_id = auth.uid());

CREATE POLICY "Representatives can create groups"
  ON groups FOR INSERT
  WITH CHECK (representative_id = auth.uid());

CREATE POLICY "Representatives can update own groups"
  ON groups FOR UPDATE
  USING (representative_id = auth.uid());

-- Group members policies
CREATE POLICY "Representatives can view group members"
  ON group_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = group_members.group_id
    AND groups.representative_id = auth.uid()
  ));

CREATE POLICY "Representatives can add group members"
  ON group_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = group_members.group_id
    AND groups.representative_id = auth.uid()
  ));
