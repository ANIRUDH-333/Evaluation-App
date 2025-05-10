import React from 'react';
import { Team, Parameter, Scores } from '../types';
import { Judge } from '../lib/supabase';
import ParameterCard from './ParameterCard';
import ScoreSummary from './ScoreSummary';

interface TeamEvaluationProps {
  activeTeam: Team;
  judge: Judge;
  parameters: Parameter[];
  scores: Scores;
  updateScore: (teamId: number, parameterId: number, value: number | null) => void;
}

const TeamEvaluation: React.FC<TeamEvaluationProps> = ({ 
  activeTeam, 
  judge,
  parameters, 
  scores, 
  updateScore 
}) => {
  const judgeScores = scores[judge.id] || {};
  const teamScores = judgeScores[activeTeam.id] || {};

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">{activeTeam.name} Evaluation</h2>
        <p className="text-primary-dark/60 mt-1">
          Score each parameter on a scale from 1 to 10
        </p>
      </div>

      <ScoreSummary 
        activeTeam={activeTeam}
        judge={judge}
        parameters={parameters} 
        scores={scores} 
      />

      <div className="space-y-4">
        {parameters.map(parameter => (
          <ParameterCard
            key={parameter.id}
            parameter={parameter}
            score={teamScores[parameter.id] !== undefined ? teamScores[parameter.id] : null}
            onChange={(value) => updateScore(activeTeam.id, parameter.id, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamEvaluation;