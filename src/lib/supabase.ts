import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Judge = {
  id: number;
  name: string;
  auth_id: string;
};

export async function getJudgeProfile() {
  try {
    // First check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) return null;

    // Then get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return null;

    // Query the judges table
    const { data: judge, error: judgeError } = await supabase
      .from('judges')
      .select('*')
      .eq('auth_id', user.id)
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