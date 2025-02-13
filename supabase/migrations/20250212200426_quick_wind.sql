/*
  # Create Consent Pathway Risk Assessment Tables

  1. New Tables
    - `consent_months`
      - `id` (uuid, primary key)
      - `month_year` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `total_assessments` (integer)
      - `risk_level_summary` (jsonb)
    
    - `consent_assessments`
      - `id` (uuid, primary key)
      - `month_id` (uuid, foreign key)
      - `design_change` (text)
      - `proposed_consent_pathway` (text)
      - `current_risk_level` (text)
      - `comments` (text)
      - `timestamp` (timestamptz)
      - `risk_change` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create consent_months table
CREATE TABLE IF NOT EXISTS consent_months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year text UNIQUE NOT NULL CHECK (month_year ~ '^\d{4}-\d{2}$'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  total_assessments integer DEFAULT 0,
  risk_level_summary jsonb DEFAULT '{"green": 0, "yellow": 0, "amber": 0, "red": 0}'::jsonb
);

-- Create consent_assessments table
CREATE TABLE IF NOT EXISTS consent_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id uuid REFERENCES consent_months(id) ON DELETE CASCADE,
  design_change text NOT NULL,
  proposed_consent_pathway text NOT NULL,
  current_risk_level text NOT NULL CHECK (current_risk_level IN ('Green', 'Yellow', 'Amber', 'Red')),
  comments text,
  timestamp timestamptz DEFAULT now(),
  risk_change text CHECK (risk_change IN ('Unknown', 'Unchanged', 'Up', 'Down'))
);

-- Enable Row Level Security
ALTER TABLE consent_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for consent_months
CREATE POLICY "Allow authenticated read access to consent_months"
  ON consent_months
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert access to consent_months"
  ON consent_months
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to consent_months"
  ON consent_months
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for consent_assessments
CREATE POLICY "Allow authenticated read access to consent_assessments"
  ON consent_assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert access to consent_assessments"
  ON consent_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to consent_assessments"
  ON consent_assessments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update risk level summary
CREATE OR REPLACE FUNCTION update_risk_level_summary()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE consent_months
  SET risk_level_summary = (
    SELECT jsonb_build_object(
      'green', COUNT(*) FILTER (WHERE current_risk_level = 'Green'),
      'yellow', COUNT(*) FILTER (WHERE current_risk_level = 'Yellow'),
      'amber', COUNT(*) FILTER (WHERE current_risk_level = 'Amber'),
      'red', COUNT(*) FILTER (WHERE current_risk_level = 'Red')
    ),
    total_assessments = COUNT(*),
    updated_at = now()
  FROM consent_assessments
  WHERE consent_assessments.month_id = consent_months.id
  GROUP BY consent_months.id)
  WHERE id = NEW.month_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating risk level summary
CREATE TRIGGER update_risk_level_summary_trigger
AFTER INSERT OR UPDATE OR DELETE ON consent_assessments
FOR EACH ROW
EXECUTE FUNCTION update_risk_level_summary();

-- Create function to calculate risk change
CREATE OR REPLACE FUNCTION calculate_risk_change()
RETURNS TRIGGER AS $$
DECLARE
  prev_month text;
  prev_risk_level text;
  risk_levels text[] := ARRAY['Green', 'Yellow', 'Amber', 'Red'];
  curr_risk_index integer;
  prev_risk_index integer;
BEGIN
  -- Get the previous month
  SELECT month_year INTO prev_month
  FROM consent_months
  WHERE month_year < (
    SELECT month_year 
    FROM consent_months 
    WHERE id = NEW.month_id
  )
  ORDER BY month_year DESC
  LIMIT 1;

  -- If no previous month exists, set as Unknown
  IF prev_month IS NULL THEN
    NEW.risk_change := 'Unknown';
    RETURN NEW;
  END IF;

  -- Get the risk level from previous month for this design change
  SELECT current_risk_level INTO prev_risk_level
  FROM consent_assessments ca
  JOIN consent_months cm ON ca.month_id = cm.id
  WHERE cm.month_year = prev_month
  AND ca.design_change = NEW.design_change
  ORDER BY ca.timestamp DESC
  LIMIT 1;

  -- If no previous assessment exists, set as Unknown
  IF prev_risk_level IS NULL THEN
    NEW.risk_change := 'Unknown';
    RETURN NEW;
  END IF;

  -- Calculate risk change
  curr_risk_index := array_position(risk_levels, NEW.current_risk_level);
  prev_risk_index := array_position(risk_levels, prev_risk_level);

  IF curr_risk_index = prev_risk_index THEN
    NEW.risk_change := 'Unchanged';
  ELSIF curr_risk_index < prev_risk_index THEN
    NEW.risk_change := 'Up';
  ELSE
    NEW.risk_change := 'Down';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for calculating risk change
CREATE TRIGGER calculate_risk_change_trigger
BEFORE INSERT OR UPDATE ON consent_assessments
FOR EACH ROW
EXECUTE FUNCTION calculate_risk_change();