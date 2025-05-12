import React, { useEffect, useState } from 'react';
import { getAllScores } from '../lib/supabase';
import { teams } from '../data/teams';
import { parameters } from '../data/parameters';

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