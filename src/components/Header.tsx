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
    const { error } = await supabase.auth.signOut();
    if (!error) {
    window.location.reload(); // Forces a full page refresh
  } else {
    console.error('Logout error:', error.message);
  }
  };

  return (
    <header className="bg-gradient-primary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* <ClipboardCheck className="h-8 w-8 text-accent-yellow mr-3" /> */}
          <img
            src="/Gw.png"
            alt="Custom Icon"
            className="h-8 w-8 mr-3"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-content-light">
              Dev<span className="text-accent-yellow">Summit</span> Demo Jam Evaluation
            </h1>
            <p className="text-sm text-primary-light">
              {isAdmin ? 'Admin' : 'Judge'}: {judgeName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
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