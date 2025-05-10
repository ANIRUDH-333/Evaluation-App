/*
  # Add sample judges for testing

  1. Changes
    - Insert two sample judges into the judges table
*/

INSERT INTO auth.users (id, email)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'judge1@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'judge2@example.com');

INSERT INTO judges (id, name, auth_id)
VALUES 
  (1, 'Alice Johnson', '11111111-1111-1111-1111-111111111111'),
  (2, 'Bob Smith', '22222222-2222-2222-2222-222222222222');