import React, { useMemo } from 'react';
import { Team, Parameter, Scores } from '../types';
import { Judge } from '../lib/supabase';

interface ScoreSummaryProps {
  activeTeam: Team;
  judge: Judge;
  parameters: Parameter[];
  scores: Scores;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ activeTeam, judge, parameters, scores }) => {
  const judgeScores = scores[judge.id] || {};
  const teamScores = judgeScores[activeTeam.id] || {};
  
  const completedParameters = useMemo(() => {
    return parameters.filter(p => teamScores[p.id] !== undefined && teamScores[p.id] !== null).length;
  }, [parameters, teamScores]);
  
  const averageScore = useMemo(() => {
    const validScores = parameters
      .map(p => teamScores[p.id])
      .filter((score): score is number => score !== undefined && score !== null);
    
    if (validScores.length === 0) return 0;
    
    const sum = validScores.reduce((acc, score) => acc + score, 0);
    return sum / validScores.length;
  }, [parameters, teamScores]);

  const progressPercentage = (completedParameters / parameters.length) * 100;

  return (
    <div className="bg-gradient-primary rounded-lg p-6 mb-6 text-content-light">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Score Summary</h3>
        <span className="text-sm opacity-80">Judge: {judge.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-content-light/10 backdrop-blur p-4 rounded-md">
          <p className="text-sm opacity-80">Parameters Scored</p>
          <p className="text-xl font-semibold mt-1">
            {completedParameters} <span className="text-sm font-normal opacity-60">/ {parameters.length}</span>
          </p>
        </div>
        
        <div className="bg-content-light/10 backdrop-blur p-4 rounded-md">
          <p className="text-sm opacity-80">Average Score</p>
          <p className="text-xl font-semibold mt-1">
            {averageScore ? averageScore.toFixed(1) : '-'}
            <span className="text-sm font-normal opacity-60"> / 10</span>
          </p>
        </div>
        
        <div className="bg-content-light/10 backdrop-blur p-4 rounded-md">
          <p className="text-sm opacity-80">Completion</p>
          <div className="mt-2">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-content-light/20">
              <div 
                style={{ width: `${progressPercentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  progressPercentage < 50 ? 'bg-accent-yellow' : progressPercentage < 100 ? 'bg-primary-light' : 'bg-accent-green'
                } transition-all duration-500 ease-in-out`}
              ></div>
            </div>
            <p className="text-sm font-medium mt-1">{progressPercentage.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;