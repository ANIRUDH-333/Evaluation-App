import React, { useState, useCallback, useEffect } from 'react';
import { teams } from './data/teams';
import { parameters } from './data/parameters';
import { Scores } from './types';
import TeamTabs from './components/TeamTabs';
import TeamEvaluation from './components/TeamEvaluation';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './components/Auth';
import { supabase, getJudgeProfile, type Judge } from './lib/supabase';
import { User } from '@supabase/supabase-js';

function App() {
  const [activeTeamId, setActiveTeamId] = useState(teams[0].id);
  const [scores, setScores] = useState<Scores>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isScoresLoading, setIsScoresLoading] = useState(false);
  const [judge, setJudge] = useState<Judge | null>(null);
  const [user_, setUser] = useState<User | null>(null);;
  const [isSessionChecked, setIsSessionChecked] = useState(false);


  const checkSession = async () => {
  try {
    // Wait for the initial session restoration
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user ?? null);

    if (!session) {
      console.log('No session found on initial load.');
      setJudge(null);
      setIsLoading(false);
      return;
    }

    // Get the judge profile
    const judge = await getJudgeProfile(session.user);
    setJudge(judge);
  } catch (error) {
    console.error('Error checking session:', error);
    setJudge(null);
  } finally {
    setIsLoading(false);
    setIsSessionChecked(true);
  }
};


  useEffect(() => {
    checkSession();

  // Set up auth state listener
  // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  //   console.log('Auth state changed:', event);
    
  //   if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
  //     if (session) {
  //       try {
  //         setUser(session.user)
  //         // Then get the user from the session
  //         const judge = await getJudgeProfile(user_);
  //         setJudge(judge);
  //       } catch (error) {
  //         console.error('Error getting judge profile:', error);
  //         setJudge(null);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   } else if (event === 'SIGNED_OUT') {
  //     setJudge(null);
  //     setIsLoading(false);
  //   }
  // });
  
  // return () => subscription.unsubscribe();
}, []);

  const fetchScores = async () => {
    if (!judge) return;

    setIsScoresLoading(true);
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('judge_id', judge.id);

      if (error) throw error;

      const formattedScores: Scores = {};
      data?.forEach(score => {
        if (!formattedScores[score.judge_id]) {
          formattedScores[score.judge_id] = {};
        }
        if (!formattedScores[score.judge_id][score.team_id]) {
          formattedScores[score.judge_id][score.team_id] = {};
        }
        formattedScores[score.judge_id][score.team_id][score.parameter_id] = score.score;
      });

      setScores(formattedScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setIsScoresLoading(false);
    }
  };

  useEffect(() => {
    if (judge) {
      fetchScores();
    }
  }, [judge]);

  const updateScore = useCallback(async (teamId: number, parameterId: number, value: number | null) => {
    if (!judge || value === null) return;

    try {
      const { error } = await supabase
        .from('scores')
        .upsert({
          judge_id: judge.id,
          team_id: teamId,
          parameter_id: parameterId,
          score: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'judge_id,team_id,parameter_id'
        });

      if (error) throw error;

      setScores(prevScores => {
        const judgeScores = prevScores[judge.id] || {};
        const teamScores = judgeScores[teamId] || {};
        
        return {
          ...prevScores,
          [judge.id]: {
            ...judgeScores,
            [teamId]: {
              ...teamScores,
              [parameterId]: value
            }
          }
        };
      });
    } catch (error) {
      console.error('Error updating score:', error);
    }
  }, [judge]);

  const resetScores = useCallback(async () => {
    if (!judge) return;

    if (window.confirm('Are you sure you want to reset all your scores? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('scores')
          .delete()
          .eq('judge_id', judge.id);

        if (error) throw error;
        
        setScores({});
      } catch (error) {
        console.error('Error resetting scores:', error);
      }
    }
  }, [judge]);

  if (!isSessionChecked) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark/5">
      <div className="text-primary text-lg">Checking session...</div>
    </div>
  );
}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark/5">
        <div className="text-primary text-lg">Loading...</div>
      </div>
    );
  }

  if (!judge) {
    return <Auth onSignIn={checkSession} />;
  }

  const activeTeam = teams.find(team => team.id === activeTeamId)!;

  return (
    <div className="min-h-screen flex flex-col bg-primary-dark/5">
      <Header resetScores={resetScores} judgeName={judge.name} />
      
      <main className="flex-grow container mx-auto px-4 py-6 bg-content-light rounded-lg my-6 shadow-lg">
        <div className="mb-6">
          <TeamTabs 
            teams={teams} 
            activeTeam={activeTeamId} 
            setActiveTeam={setActiveTeamId} 
          />
        </div>
        
        {isScoresLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-primary text-lg">Loading scores...</div>
          </div>
        ) : (
          <TeamEvaluation 
            activeTeam={activeTeam}
            judge={judge}
            parameters={parameters}
            scores={scores}
            updateScore={updateScore}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;