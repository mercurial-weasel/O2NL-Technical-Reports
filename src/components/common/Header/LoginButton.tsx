import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@lib/auth';
import { shadows } from '../../../constants/theme';

export function LoginButton() {
  const navigate = useNavigate();
  const { state, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (state.loading) {
    return (
      <div data-testid="loading-pulse" className="animate-pulse">
        <div className="w-24 h-9 bg-gray-700/50 rounded-lg"></div>
      </div>
    );
  }

  if (state.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm text-text-secondary">{state.user.email}</span>
          <span className="text-xs font-medium text-text-primary">
            {state.user.firstName} {state.user.lastName}
          </span>
          <div className="flex gap-1.5">
            {state.user.accessRights.map((right, index) => (
              <span 
                key={right} 
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  right === 'Admin' ? 'bg-red-500/20 text-red-400' :
                  right === 'PAB' ? 'bg-blue-500/20 text-blue-400' :
                  right === 'AMT' ? 'bg-green-500/20 text-green-400' :
                  right === 'Commercial' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}
              >
                {right}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={`relative group px-4 py-2 bg-gradient-to-b from-red-600 to-red-700 text-text-primary font-medium rounded-lg ${shadows.button.primary} transition-all duration-200 hover:${shadows.button.hover} hover:translate-y-[-1px] active:translate-y-[1px]`}
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.15] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="relative flex items-center gap-2">
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[2px]" />
            <span className="text-sm">Sign Out</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => navigate('/login')}
      className={`relative group px-4 py-2 bg-gradient-to-b from-brand-secondary to-[#0055CC] text-text-primary font-medium rounded-lg ${shadows.button.primary} transition-all duration-200 hover:${shadows.button.hover} hover:translate-y-[-1px] active:translate-y-[1px]`}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.15] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="relative flex items-center gap-2">
        <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[-2px]" />
        <span className="text-sm">Sign In</span>
      </div>
    </button>
  );
}