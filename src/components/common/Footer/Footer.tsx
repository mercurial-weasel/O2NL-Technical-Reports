import React from 'react';
import pkg from '../../../../package.json';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  // Get environment variables
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const debugAccessRights = import.meta.env.VITE_DEBUG_ACCESS_RIGHTS === 'true';
  const bypassAuth = import.meta.env.VITE_BYPASS_AUTHENTICATION === 'true';

  return (
    <footer className={`bg-gray-800 py-4 px-6 ${className}`}>
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} O2NL. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            {/* Social links or other footer links can go here */}
          </div>
        </div>

        {/* Version and environment info */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 flex flex-wrap gap-3">
            <span>Version: {pkg.version}</span>
            <span>|</span>
            <span title="Using mock data">Mock Data: {useMockData ? '✓' : '✗'}</span>
            <span>|</span>
            <span title="Debugging access rights">Debug Rights: {debugAccessRights ? '✓' : '✗'}</span>
            <span>|</span>
            <span title="Bypassing authentication">Bypass Auth: {bypassAuth ? '✓' : '✗'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}