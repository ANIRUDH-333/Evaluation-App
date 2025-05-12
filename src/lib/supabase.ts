import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Judge = {
  id: number;
  name: string;
  auth_id: string;
};

export async function getJudgeProfile(userData: User | null) {
  try {

    if (!userData) return null;

    // Query the judges table
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
