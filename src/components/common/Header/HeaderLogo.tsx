import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export function HeaderLogo() {
  return (
    <Link 
      to="/"
      className="flex items-center gap-3 group"
    >
      <div className="relative">
        <LayoutDashboard className="w-8 h-8 text-text-primary transition-transform duration-200 group-hover:scale-110" />
        <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <span className="text-xl font-semibold text-text-primary relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/[0.08] before:to-white/0 before:translate-y-full before:opacity-0 hover:before:translate-y-0 hover:before:opacity-100 before:transition-all before:duration-300">
        O2NL Intelligence
      </span>
    </Link>
  );
}