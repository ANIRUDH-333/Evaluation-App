/*
  # Add admin functionality

  1. Changes
    - Add is_admin column to judges table
    - Create parameters_admin table for admin-only parameters
    - Set up initial admin user

  2. Security
    - Enable RLS on parameters_admin table
    - Add policies for admin access
*/

-- Add is_admin column to judges
ALTER TABLE judges ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin-only parameters table
CREATE TABLE IF NOT EXISTS parameters_admin (
  id integer PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE parameters_admin ENABLE ROW LEVEL SECURITY;

-- Admin can read admin parameters
CREATE POLICY "Admins can read admin parameters"
  ON parameters_admin
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM judges 
    WHERE auth_id = auth.uid() 
    AND is_admin = true
  ));

-- Insert admin parameter
INSERT INTO parameters_admin (id, name, description)
VALUES (1, 'Business Potential', 'Commercial viability and market potential of the solution');

-- Update existing judge to be admin
UPDATE judges 
SET is_admin = true 
WHERE auth_id = '11111111-1111-1111-1111-111111111111';