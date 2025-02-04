import React from 'react';
import { Link } from 'react-router-dom';
import { TestTubes, Map } from 'lucide-react';

export function HeaderNav() {
  return (
    <nav className="hidden md:flex items-center gap-4">
      <Link 
        to="/tests" 
        className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group"
      >
        <div className="p-1.5 rounded-lg bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors">
          <TestTubes className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Tests</span>
      </Link>
      <Link 
        to="/roadmap" 
        className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group"
      >
        <div className="p-1.5 rounded-lg bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors">
          <Map className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Roadmap</span>
      </Link>
    </nav>
  );
}