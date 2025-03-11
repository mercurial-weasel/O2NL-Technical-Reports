import React from 'react';
import { BackgroundGrid } from './BackgroundGrid';
import { GradientOverlay } from './GradientOverlay';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-background-base via-background-darker to-background-base py-12 min-h-[300px] flex items-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <GradientOverlay />
        <div className="absolute inset-0">
          {/* Subtle animated pattern */}
          <div className="absolute inset-0 animate-pulse-slow opacity-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          </div>
          
          <BackgroundGrid />
          
          {/* Gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-base via-transparent to-background-base" />
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-text-primary mb-4 drop-shadow-lg">
              O2NL Technical Data
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto drop-shadow-lg">
              Access and analyze O2NL project data 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}