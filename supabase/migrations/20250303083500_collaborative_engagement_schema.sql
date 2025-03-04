-- Migration: 20250303083500_collaborative_engagement_schema.sql
-- Collaborative Initiatives and Constituent Engagement Schema
-- Created on: 2025-03-03 08:35:00 UTC

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Up Migration

-- Inter-representative Collaboration
CREATE TABLE IF NOT EXISTS collaborative_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) NOT NULL, -- 'planned', 'active', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS initiative_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiative_id UUID REFERENCES collaborative_initiatives,
    staff_member_id UUID REFERENCES staff_members,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constituent Engagement Tracking
CREATE TABLE IF NOT EXISTS engagement_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'communication', 'event', 'campaign', 'collaboration'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS constituent_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituent_id UUID NOT NULL,
    engagement_type_id UUID REFERENCES engagement_types,
    staff_member_id UUID REFERENCES staff_members,
    event_id UUID REFERENCES events,
    campaign_id UUID REFERENCES campaigns,
    notes TEXT,
    engagement_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE collaborative_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituent_engagements ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_initiative_participants_initiative ON initiative_participants(initiative_id);
CREATE INDEX IF NOT EXISTS idx_initiative_participants_staff ON initiative_participants(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_constituent_engagements_type ON constituent_engagements(engagement_type_id);
CREATE INDEX IF NOT EXISTS idx_constituent_engagements_staff ON constituent_engagements(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_constituent_engagements_date ON constituent_engagements(engagement_date);

-- Down Migration
DROP TABLE IF EXISTS constituent_engagements;
DROP TABLE IF EXISTS engagement_types;
DROP TABLE IF EXISTS initiative_participants;
DROP TABLE IF EXISTS collaborative_initiatives;
