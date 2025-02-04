import React from 'react';
import { LogIn } from 'lucide-react';
import { shadows } from '../../../constants/theme';

export function LoginButton() {
  return (
    <button className={`relative group px-4 py-2 bg-gradient-to-b from-brand-secondary to-[#0055CC] text-text-primary font-medium rounded-lg ${shadows.button.primary} transition-all duration-200 hover:${shadows.button.hover} hover:translate-y-[-1px] active:translate-y-[1px]`}>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.15] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="relative flex items-center gap-2">
        <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[-2px]" />
        <span className="text-sm">Log In</span>
      </div>
    </button>
  );
}