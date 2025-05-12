import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Judge = {
  id: number;
  name: string;
  auth_id: string;
  is_admin: boolean;
};

export async function getJudgeProfile(userData: User | null) {
  try {
    if (!userData) return null;

    const { data: judge, error: judgeError } = await supabase
      .from('judges')
      .select('*')
      .eq('auth_id', userData.id)
      .single();

    if (judgeError) {
      console.error('Judge profile error:', judgeError);
      return null;
    }

    return judge;
  } catch (error) {
    console.error('Error in getJudgeProfile:', error);
    return null;
  }
}

export async function getAllScores() {
  const { data, error } = await supabase
    .from('scores')
    .select(`
      *,
      judges (name),
      parameters (name)
    `);

  if (error) {
    console.error('Error fetching all scores:', error);
    return null;
  }

  return data;
}

export async function getAdminParameters() {
  const { data, error } = await supabase
    .from('parameters_admin')
    .select('*');

  if (error) {
    console.error('Error fetching admin parameters:', error);
    return null;
  }

  return data;
}