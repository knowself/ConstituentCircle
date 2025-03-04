-- Migration: 20250303082000_advanced_features.sql
-- Advanced Features for Constituent Circle Database
-- Created on: 2025-03-03 08:20:00 UTC

-- Create campaigns table for organizing communication efforts
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  representative_id UUID REFERENCES representatives(id),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  target_audience JSONB DEFAULT '{}'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create campaign_communications junction table
CREATE TABLE IF NOT EXISTS campaign_communications (
  campaign_id UUID REFERENCES campaigns(id),
  communication_id UUID REFERENCES communications(id),
  sequence_order INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (campaign_id, communication_id)
);

-- Create constituent_segments table for targeted communications
CREATE TABLE IF NOT EXISTS constituent_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  representative_id UUID REFERENCES representatives(id),
  name TEXT NOT NULL,
  description TEXT,
  filter_criteria JSONB NOT NULL,
  is_dynamic BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create segment_members junction table
CREATE TABLE IF NOT EXISTS segment_members (
  segment_id UUID REFERENCES constituent_segments(id),
  constituent_id UUID REFERENCES constituents(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  PRIMARY KEY (segment_id, constituent_id)
);

-- Add campaign tracking to communications
ALTER TABLE communications
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id),
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_metadata JSONB DEFAULT '{}'::jsonb;

-- Enhance constituents table with additional segmentation data
ALTER TABLE constituents
ADD COLUMN IF NOT EXISTS demographic_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS issue_interests TEXT[],
ADD COLUMN IF NOT EXISTS communication_history_summary JSONB DEFAULT '{}'::jsonb;

-- Create indexes for new tables and columns
CREATE INDEX IF NOT EXISTS idx_campaigns_representative ON campaigns(representative_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_communications_campaign ON communications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_communications_scheduled ON communications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_segments_representative ON constituent_segments(representative_id);

-- Enable RLS on new tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituent_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Representatives can view own campaigns"
  ON campaigns FOR SELECT
  USING (representative_id = auth.uid());

CREATE POLICY "Representatives can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (representative_id = auth.uid());

CREATE POLICY "Representatives can update own campaigns"
  ON campaigns FOR UPDATE
  USING (representative_id = auth.uid());

-- Create RLS policies for campaign_communications
CREATE POLICY "Representatives can view own campaign communications"
  ON campaign_communications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM campaigns
    WHERE campaigns.id = campaign_communications.campaign_id
    AND campaigns.representative_id = auth.uid()
  ));

CREATE POLICY "Representatives can manage campaign communications"
  ON campaign_communications FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM campaigns
    WHERE campaigns.id = campaign_communications.campaign_id
    AND campaigns.representative_id = auth.uid()
  ));

-- Create RLS policies for constituent_segments
CREATE POLICY "Representatives can view own segments"
  ON constituent_segments FOR SELECT
  USING (representative_id = auth.uid());

CREATE POLICY "Representatives can create segments"
  ON constituent_segments FOR INSERT
  WITH CHECK (representative_id = auth.uid());

CREATE POLICY "Representatives can update own segments"
  ON constituent_segments FOR UPDATE
  USING (representative_id = auth.uid());

-- Create RLS policies for segment_members
CREATE POLICY "Representatives can view segment members"
  ON segment_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM constituent_segments
    WHERE constituent_segments.id = segment_members.segment_id
    AND constituent_segments.representative_id = auth.uid()
  ));

CREATE POLICY "Representatives can manage segment members"
  ON segment_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM constituent_segments
    WHERE constituent_segments.id = segment_members.segment_id
    AND constituent_segments.representative_id = auth.uid()
  ));

-- Create function to automatically update segment members for dynamic segments
CREATE OR REPLACE FUNCTION refresh_dynamic_segment()
RETURNS TRIGGER AS $$
DECLARE
  segment_record RECORD;
BEGIN
  -- Get segment information from the NEW record
  SELECT * INTO segment_record FROM constituent_segments WHERE id = NEW.id;
  
  -- Only process if segment is dynamic
  IF segment_record.is_dynamic THEN
    -- Clear existing members
    DELETE FROM segment_members WHERE segment_id = segment_id;
    
    -- Insert constituents matching criteria
    -- This is a simplified version - in production, you would parse the filter_criteria JSONB
    -- and build a dynamic query based on those criteria
    INSERT INTO segment_members (segment_id, constituent_id)
    SELECT 
      segment_id,
      constituents.id
    FROM 
      constituents
    WHERE 
      EXISTS (
        SELECT 1 FROM representatives 
        WHERE representatives.id = segment_record.representative_id
        AND representatives.district = constituents.district
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh dynamic segments when filter criteria changes
CREATE TRIGGER refresh_segment_on_update
  AFTER UPDATE OF filter_criteria ON constituent_segments
  FOR EACH ROW
  WHEN (NEW.is_dynamic = TRUE)
  EXECUTE FUNCTION refresh_dynamic_segment();

-- Create trigger to refresh all dynamic segments periodically (would be called by a scheduled job)
CREATE OR REPLACE FUNCTION refresh_all_dynamic_segments()
RETURNS VOID AS $$
DECLARE
  segment_record RECORD;
BEGIN
  FOR segment_record IN SELECT id FROM constituent_segments WHERE is_dynamic = TRUE LOOP
    PERFORM refresh_dynamic_segment(segment_record.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql;