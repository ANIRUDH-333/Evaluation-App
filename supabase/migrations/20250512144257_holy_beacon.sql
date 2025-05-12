/*
  # Set password for admin user

  1. Changes
    - Set password for admin user (judge1@example.com)
*/

-- Set password for admin user
UPDATE auth.users
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'judge1@example.com';