-- Migration: 20250303082500_message_templates.sql
-- Message Templates and Enhanced Communication Features
-- Created on: 2025-03-03 08:25:00 UTC

-- Create message_templates table for reusable communications
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  representative_id UUID REFERENCES representatives(id),
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add template tracking to communications
ALTER TABLE communications
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES message_templates(id),
ADD COLUMN IF NOT EXISTS template_variables JSONB DEFAULT '{}'::jsonb;

-- Create indexes for message templates
CREATE INDEX IF NOT EXISTS idx_templates_representative ON message_templates(representative_id);
CREATE INDEX IF NOT EXISTS idx_communications_template ON communications(template_id);

-- Create index on type column separately to handle potential issues
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'message_templates' AND column_name = 'type'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_templates_type ON message_templates(type)';
  END IF;
END$$;

-- Enable RLS on message_templates
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for message_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'message_templates' AND policyname = 'Representatives can view own templates'
  ) THEN
    CREATE POLICY "Representatives can view own templates"
      ON message_templates FOR SELECT
      USING (representative_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'message_templates' AND policyname = 'Representatives can create templates'
  ) THEN
    CREATE POLICY "Representatives can create templates"
      ON message_templates FOR INSERT
      WITH CHECK (representative_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'message_templates' AND policyname = 'Representatives can update own templates'
  ) THEN
    CREATE POLICY "Representatives can update own templates"
      ON message_templates FOR UPDATE
      USING (representative_id = auth.uid());
  END IF;
END$$;

-- Create function to generate personalized message from template
CREATE OR REPLACE FUNCTION generate_message_from_template(
  template_id UUID,
  variables JSONB
) RETURNS TEXT AS $$
DECLARE
  template_content TEXT;
  result TEXT;
  var_key TEXT;
  var_value TEXT;
BEGIN
  -- Get template content
  SELECT content INTO template_content
  FROM message_templates
  WHERE id = template_id;

  -- Start with template content
  result := template_content;

  -- Replace variables
  FOR var_key, var_value IN
    SELECT * FROM jsonb_each_text(variables)
  LOOP
    result := replace(result, '{{' || var_key || '}}', var_value);
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate template variables
CREATE OR REPLACE FUNCTION validate_template_variables(
  template_id UUID,
  variables JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  template_vars JSONB;
  required_var TEXT;
BEGIN
  -- Get template required variables
  SELECT t.variables INTO template_vars
  FROM message_templates t
  WHERE t.id = template_id;

  -- Check if all required variables are provided
  FOR required_var IN
    SELECT jsonb_object_keys(template_vars)
    WHERE template_vars->required_var->>'required' = 'true'
  LOOP
    IF variables->required_var IS NULL THEN
      RETURN FALSE;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate template variables before communication insert
CREATE OR REPLACE FUNCTION validate_communication_template()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.template_id IS NOT NULL THEN
    IF NOT validate_template_variables(NEW.template_id, COALESCE(NEW.template_variables, '{}'::jsonb)) THEN
      RAISE EXCEPTION 'Missing required template variables';
    END IF;

    -- Generate message content from template
    NEW.content := generate_message_from_template(
      NEW.template_id,
      COALESCE(NEW.template_variables, '{}'::jsonb)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_communication_template_trigger
  BEFORE INSERT OR UPDATE ON communications
  FOR EACH ROW
  WHEN (NEW.template_id IS NOT NULL)
  EXECUTE FUNCTION validate_communication_template();