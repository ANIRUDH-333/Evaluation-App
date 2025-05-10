import React from 'react';
import { ClipboardCheck } from 'lucide-react';

interface HeaderProps {
  resetScores: () => void;
  judgeName: string;
}

const Header: React.FC<HeaderProps> = ({ resetScores, judgeName }) => {
  return (
    <header className="bg-gradient-primary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <ClipboardCheck className="h-8 w-8 text-accent-yellow mr-3" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-content-light">Team Evaluation</h1>
            <p className="text-sm text-primary-light">Judge: {judgeName}</p>
          </div>
        </div>
        
        <button
          onClick={resetScores}
          className="px-4 py-2 text-sm font-medium bg-content-light text-primary hover:bg-opacity-90 rounded-md transition-colors duration-200"
        >
          Reset My Scores
        </button>
      </div>
    </header>
  );
};

export default Header