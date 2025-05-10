import React from 'react';
import { Parameter } from '../types';

interface ParameterCardProps {
  parameter: Parameter;
  score: number | null;
  onChange: (value: number | null) => void;
}

const ParameterCard: React.FC<ParameterCardProps> = ({ parameter, score, onChange }) => {
  const scoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-content-light rounded-lg shadow-sm border border-primary/10 p-6 mb-4 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-3 md:mb-0 md:mr-4 flex-1">
          <h3 className="text-base md:text-lg font-medium text-primary-dark">{parameter.name}</h3>
          <p className="text-sm text-content-dark/60 mt-1">{parameter.description}</p>
        </div>
        
        <div className="flex items-center">
          <label htmlFor={`score-${parameter.id}`} className="text-sm font-medium text-primary mr-3">
            Score:
          </label>
          <select
            id={`score-${parameter.id}`}
            value={score === null ? '' : score}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className={`rounded-md border border-primary/20 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
              score === null ? 'text-content-dark/40' : 'text-content-dark'
            }`}
          >
            <option value="">Select</option>
            {scoreOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ParameterCard