import React, { useEffect, useState } from 'react';
import { getAllScores, supabase } from '../lib/supabase';
import { teams } from '../data/teams';

interface AggregateScore {
  teamId: number;
  teamName: string;
  averageScore: number;
  totalJudges: number;
}

const AdminDashboard: React.FC = () => {
  const [aggregateScores, setAggregateScores] = useState<AggregateScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [decibelScore, setDecibelScore] = useState<number | null>(null);
  const [judgeLimit, setJudgeLimit] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scores = await getAllScores();

        if (!scores) {
          setError('Failed to fetch scores');
          setLoading(false);
          return;
        }

        const scoresByTeam = teams.map(team => {
          const teamScores = scores.filter(score => score.team_id === team.id);
          const uniqueJudges = new Set(teamScores.map(score => score.judge_id));
          const totalScore = teamScores.reduce((sum, score) => sum + score.score, 0);
          const averageScore = totalScore / (teamScores.length || 1);

          return {
            teamId: team.id,
            teamName: team.name,
            averageScore: Number(averageScore.toFixed(2)),
            totalJudges: uniqueJudges.size
          };
        });

        setAggregateScores(scoresByTeam.sort((a, b) => b.averageScore - a.averageScore));
      } catch (err) {
        setError('An error occurred while processing scores');
        console.error('Error in fetchScores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const handleSubmit = async () => {
    if (selectedTeamId === null || decibelScore === null || judgeLimit < 1) return;

    setIsSubmitting(true);

    try {
      // Create an array of judge IDs from 1 to judgeLimit
      const judgeIds = Array.from({ length: judgeLimit }, (_, i) => i + 1);
      
      const upserts = judgeIds.map(judgeId => ({
        judge_id: judgeId,
        team_id: selectedTeamId,
        parameter_id: 6, // Decibel Meter
        score: decibelScore,
        updated_at: new Date().toISOString(),
      }));

      const { error: upsertError } = await supabase
        .from('scores')
        .upsert(upserts, {
          onConflict: 'judge_id,team_id,parameter_id',
        });

      if (upsertError) throw upsertError;

      alert(`Decibel Meter score updated for ${judgeLimit} judge(s) (IDs: ${judgeIds.join(', ')}).`);
      
      // Refresh scores after update
      const scores = await getAllScores();
      if (scores) {
        const scoresByTeam = teams.map(team => {
          const teamScores = scores.filter(score => score.team_id === team.id);
          const uniqueJudges = new Set(teamScores.map(score => score.judge_id));
          const totalScore = teamScores.reduce((sum, score) => sum + score.score, 0);
          const averageScore = totalScore / (teamScores.length || 1);

          return {
            teamId: team.id,
            teamName: team.name,
            averageScore: Number(averageScore.toFixed(2)),
            totalJudges: uniqueJudges.size
          };
        });

        setAggregateScores(scoresByTeam.sort((a, b) => b.averageScore - a.averageScore));
      }
    } catch (error) {
      console.error('Error updating decibel score:', error);
      alert('Failed to update decibel score.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary text-lg">Loading scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Team Rankings</h2>

        {/* Decibel Score Update */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Update Decibel Meter Score</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <select
              className="border rounded p-2"
              value={selectedTeamId ?? ''}
              onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            >
              <option value="" disabled>Select Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              max={10}
              className="border rounded p-2 w-32"
              placeholder="Score"
              value={decibelScore ?? ''}
              onChange={(e) => setDecibelScore(Number(e.target.value))}
            />

            <input
              type="number"
              min={1}
              className="border rounded p-2 w-32"
              placeholder="Judge Count"
              value={judgeLimit}
              onChange={(e) => setJudgeLimit(Number(e.target.value))}
            />

            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judges</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aggregateScores.map((score, index) => (
                <tr key={score.teamId} className={index === 0 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score.teamName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score.averageScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score.totalJudges}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;