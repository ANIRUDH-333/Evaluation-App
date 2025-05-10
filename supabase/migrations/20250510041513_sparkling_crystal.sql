/*
  # Link judges to auth users

  1. Changes
    - Add auth_id column to judges table
    - Add RLS policies for judges

  2. Security
    - Enable RLS on judges table
    - Add policies to allow judges to access their own data
*/

CREATE TABLE IF NOT EXISTS judges (
  id integer PRIMARY KEY,
  name text NOT NULL,
  auth_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE judges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges can read their own data"
  ON judges
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

-- Update scores RLS policies to be auth-aware
DROP POLICY IF EXISTS "Enable read access for all users" ON scores;
DROP POLICY IF EXISTS "Enable insert access for all users" ON scores;
DROP POLICY IF EXISTS "Enable update access for all users" ON scores;

CREATE POLICY "Judges can read their own scores"
  ON scores
  FOR SELECT
  TO authenticated
  USING (judge_id IN (SELECT id FROM judges WHERE auth_id = auth.uid()));

CREATE POLICY "Judges can insert their own scores"
  ON scores
  FOR INSERT
  TO authenticated
  WITH CHECK (judge_id IN (SELECT id FROM judges WHERE auth_id = auth.uid()));

CREATE POLICY "Judges can update their own scores"
  ON scores
  FOR UPDATE
  TO authenticated
  USING (judge_id IN (SELECT id FROM judges WHERE auth_id = auth.uid()));