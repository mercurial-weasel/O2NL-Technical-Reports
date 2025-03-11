import React from 'react';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { gradients, shadows } from '@constants/theme';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className={`relative ${gradients.header} backdrop-blur-sm border-t border-l border-r border-border-header rounded-2xl px-6 py-3 ${shadows.header} before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:pointer-events-none`}>
          <div className="relative flex items-center justify-between">
            <HeaderLogo />
            <div className="flex items-center gap-4">
              <HeaderNav />
              {/* LoginButton removed as we now have the Sign In button on the login page */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}