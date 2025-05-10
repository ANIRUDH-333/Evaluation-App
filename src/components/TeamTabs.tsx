import React from 'react';
import { Team } from '../types';

interface TeamTabsProps {
  teams: Team[];
  activeTeam: number;
  setActiveTeam: (id: number) => void;
}

const TeamTabs: React.FC<TeamTabsProps> = ({ teams, activeTeam, setActiveTeam }) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap overflow-x-auto pb-2 border-b border-primary/20">
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={() => setActiveTeam(team.id)}
          className={`px-6 py-3 text-sm md:text-base font-medium transition-all duration-200 ease-in-out 
            ${
              activeTeam === team.id
                ? 'text-primary border-b-2 border-primary -mb-px bg-primary/5'
                : 'text-content-dark/60 hover:text-primary hover:bg-primary/5'
            }`}
          aria-current={activeTeam === team.id ? 'page' : undefined}
        >
          {team.name}
        </button>
      ))}
    </div>
  );
};

export default TeamTabs