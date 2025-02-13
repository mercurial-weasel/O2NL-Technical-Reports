/*
  # PAB (Project Advisory Board) Schema

  1. New Tables
    - `pab_records`
      - Main table storing monthly PAB records
      - Contains high-level record info and metadata
    
    - `pab_budget_items`
      - Budget line items for each PAB record
      - Tracks shared/non-shared costs and movements
    
    - `pab_cost_items` 
      - Cost line items for each PAB record
      - Similar structure to budget items
    
    - `pab_indicators`
      - Stores various indicator types (cost, risk, expenditure, limb1, limb3)
      - Flexible structure for different indicator categories
    
    - `pab_expenditure`
      - Monthly expenditure data
      - Tracks planned, actual and forecast values
    
    - `pab_funding_split`
      - Organization funding allocation data
      - Tracks both current month and project-level splits

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    
  3. Changes
    - Initial schema creation
    - Core tables and relationships
    - Security policies
*/

-- Create enum types for various statuses and categories
CREATE TYPE pab_indicator_category AS ENUM (
  'cost',
  'risk', 
  'expenditure',
  'limb1',
  'limb3'
);

-- Main PAB records table
CREATE TABLE IF NOT EXISTS pab_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year text NOT NULL CHECK (month_year ~ '^\d{4}-\d{2}$'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_month_year UNIQUE (month_year)
);

-- Budget items table
CREATE TABLE IF NOT EXISTS pab_budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pab_record_id uuid REFERENCES pab_records(id) ON DELETE CASCADE,
  budget_item text NOT NULL,
  shared numeric,
  non_shared numeric,
  total numeric,
  ref text,
  comments text,
  movement_shared numeric,
  movement_non_shared numeric,
  movement_total numeric,
  highlight boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cost items table
CREATE TABLE IF NOT EXISTS pab_cost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pab_record_id uuid REFERENCES pab_records(id) ON DELETE CASCADE,
  budget text NOT NULL,
  shared numeric,
  non_shared numeric,
  total numeric,
  ref text,
  comments text,
  movement_shared numeric,
  movement_non_shared numeric,
  movement_total numeric,
  highlight boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indicators table (for cost, risk, expenditure, limb1, and limb3 indicators)
CREATE TABLE IF NOT EXISTS pab_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pab_record_id uuid REFERENCES pab_records(id) ON DELETE CASCADE,
  category pab_indicator_category NOT NULL,
  text text NOT NULL,
  indicator text NOT NULL,
  text_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Expenditure table
CREATE TABLE IF NOT EXISTS pab_expenditure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pab_record_id uuid REFERENCES pab_records(id) ON DELETE CASCADE,
  month text NOT NULL,
  planned_monthly numeric,
  planned_cumulative numeric,
  actual_monthly numeric,
  actual_cumulative numeric,
  forecast_monthly numeric,
  forecast_cumulative numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_record_month UNIQUE (pab_record_id, month)
);

-- Funding split table
CREATE TABLE IF NOT EXISTS pab_funding_split (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pab_record_id uuid REFERENCES pab_records(id) ON DELETE CASCADE,
  organization text NOT NULL,
  current_month_value numeric NOT NULL,
  project_value numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_record_org UNIQUE (pab_record_id, organization)
);

-- Enable Row Level Security
ALTER TABLE pab_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pab_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pab_cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pab_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE pab_expenditure ENABLE ROW LEVEL SECURITY;
ALTER TABLE pab_funding_split ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DO $$ BEGIN
  -- pab_records policies
  CREATE POLICY "Allow authenticated read access to pab_records"
    ON pab_records FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_records"
    ON pab_records FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_records"
    ON pab_records FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  -- pab_budget_items policies
  CREATE POLICY "Allow authenticated read access to pab_budget_items"
    ON pab_budget_items FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_budget_items"
    ON pab_budget_items FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_budget_items"
    ON pab_budget_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  -- pab_cost_items policies
  CREATE POLICY "Allow authenticated read access to pab_cost_items"
    ON pab_cost_items FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_cost_items"
    ON pab_cost_items FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_cost_items"
    ON pab_cost_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  -- pab_indicators policies
  CREATE POLICY "Allow authenticated read access to pab_indicators"
    ON pab_indicators FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_indicators"
    ON pab_indicators FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_indicators"
    ON pab_indicators FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  -- pab_expenditure policies
  CREATE POLICY "Allow authenticated read access to pab_expenditure"
    ON pab_expenditure FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_expenditure"
    ON pab_expenditure FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_expenditure"
    ON pab_expenditure FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  -- pab_funding_split policies
  CREATE POLICY "Allow authenticated read access to pab_funding_split"
    ON pab_funding_split FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow authenticated insert access to pab_funding_split"
    ON pab_funding_split FOR INSERT TO authenticated WITH CHECK (true);
    
  CREATE POLICY "Allow authenticated update access to pab_funding_split"
    ON pab_funding_split FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers for all tables
DO $$ BEGIN
  CREATE TRIGGER update_pab_records_updated_at
    BEFORE UPDATE ON pab_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_pab_budget_items_updated_at
    BEFORE UPDATE ON pab_budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_pab_cost_items_updated_at
    BEFORE UPDATE ON pab_cost_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_pab_indicators_updated_at
    BEFORE UPDATE ON pab_indicators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_pab_expenditure_updated_at
    BEFORE UPDATE ON pab_expenditure
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_pab_funding_split_updated_at
    BEFORE UPDATE ON pab_funding_split
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pab_records_month_year ON pab_records(month_year);
CREATE INDEX IF NOT EXISTS idx_pab_budget_items_record_id ON pab_budget_items(pab_record_id);
CREATE INDEX IF NOT EXISTS idx_pab_cost_items_record_id ON pab_cost_items(pab_record_id);
CREATE INDEX IF NOT EXISTS idx_pab_indicators_record_category ON pab_indicators(pab_record_id, category);
CREATE INDEX IF NOT EXISTS idx_pab_expenditure_record_month ON pab_expenditure(pab_record_id, month);
CREATE INDEX IF NOT EXISTS idx_pab_funding_split_record_org ON pab_funding_split(pab_record_id, organization);