import React from 'react';
import { ClipboardCheck, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  resetScores: () => void;
  judgeName: string;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ resetScores, judgeName, isAdmin }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gradient-primary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <ClipboardCheck className="h-8 w-8 text-accent-yellow mr-3" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-content-light">Team Evaluation</h1>
            <p className="text-sm text-primary-light">
              {isAdmin ? 'Admin' : 'Judge'}: {judgeName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={resetScores}
            className="px-4 py-2 text-sm font-medium bg-content-light text-primary hover:bg-opacity-90 rounded-md transition-colors duration-200"
          >
            Reset My Scores
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header