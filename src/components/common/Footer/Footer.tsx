import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-darker border-t border-border-divider py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-text-muted" />
            <span className="text-text-muted text-sm">O2NL Intelligence</span>
          </div>
          <div className="text-xs text-text-muted">
            © 2025 O2NL Alliance. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}