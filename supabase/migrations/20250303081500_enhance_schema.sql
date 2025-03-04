-- Migration: 20250303081500_enhance_schema.sql
-- Enhancing Schema for Constituent Circle Database
-- Created on: 2025-03-03 08:15:00 UTC

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  representative_id UUID REFERENCES representatives(id),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add sentiment and engagement tracking to communications
ALTER TABLE communications
ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL,
ADD COLUMN IF NOT EXISTS engagement_metrics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES message_templates(id),
ADD COLUMN IF NOT EXISTS response_to UUID REFERENCES communications(id),
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Enhance constituents table with additional profile data
ALTER TABLE constituents
ADD COLUMN IF NOT EXISTS contact_history JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS engagement_score DECIMAL,
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE;

-- Add communication preferences to representatives
ALTER TABLE representatives
ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS availability_schedule JSONB DEFAULT '{}'::jsonb;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_communications_template_id ON communications(template_id);
CREATE INDEX IF NOT EXISTS idx_communications_response_to ON communications(response_to);
CREATE INDEX IF NOT EXISTS idx_constituents_last_contact ON constituents(last_contact_date);
CREATE INDEX IF NOT EXISTS idx_constituents_engagement ON constituents(engagement_score);

-- Enable RLS on new table
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for message_templates
CREATE POLICY "Representatives can view own templates"
  ON message_templates FOR SELECT
  USING (representative_id = auth.uid());

CREATE POLICY "Representatives can create templates"
  ON message_templates FOR INSERT
  WITH CHECK (representative_id = auth.uid());

CREATE POLICY "Representatives can update own templates"
  ON message_templates FOR UPDATE
  USING (representative_id = auth.uid());

-- Create trigger to update last_contact_date
CREATE OR REPLACE FUNCTION update_constituent_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE constituents
  SET last_contact_date = NEW.sent_at
  WHERE id = NEW.constituent_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_constituent_contact
  AFTER UPDATE OF sent_at ON communications
  FOR EACH ROW
  WHEN (NEW.sent_at IS NOT NULL)
  EXECUTE FUNCTION update_constituent_last_contact();