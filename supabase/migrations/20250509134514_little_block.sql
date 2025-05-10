/*
  # Create scores table for team evaluations

  1. New Tables
    - `scores`
      - `id` (uuid, primary key)
      - `judge_id` (integer, not null)
      - `team_id` (integer, not null)
      - `parameter_id` (integer, not null)
      - `score` (integer, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `scores` table
    - Add policies for authenticated users to read and write scores
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id integer NOT NULL,
  team_id integer NOT NULL,
  parameter_id integer NOT NULL,
  score integer NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(judge_id, team_id, parameter_id)
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON scores
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON scores
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON scores
  FOR UPDATE
  TO public
  USING (true);