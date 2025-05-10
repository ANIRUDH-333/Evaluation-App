import React from 'react';
import { Judge } from '../types';
import { UserSquare2 } from 'lucide-react';

interface JudgeSelectorProps {
  judges: Judge[];
  activeJudge: number;
  setActiveJudge: (id: number) => void;
}

const JudgeSelector: React.FC<JudgeSelectorProps> = ({ judges, activeJudge, setActiveJudge }) => {
  return (
    <div className="flex items-center mt-4 md:mt-0">
      <UserSquare2 className="w-5 h-5 text-primary mr-2" />
      <select
        value={activeJudge}
        onChange={(e) => setActiveJudge(Number(e.target.value))}
        className="rounded-md border border-primary/20 py-2 px-3 text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
      >
        {judges.map((judge) => (
          <option key={judge.id} value={judge.id}>
            {judge.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default JudgeSelector;