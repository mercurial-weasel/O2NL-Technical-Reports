import React from 'react';
import { Card } from '../../../common/Card';
import { SustainabilityInitiative } from './data';
import { Leaf, Zap, Factory, Droplets, Recycle, Building2, ShoppingBag, TreePine, DivideIcon as LucideIcon } from 'lucide-react';

interface ThemeCardProps {
  theme: string;
  initiatives: SustainabilityInitiative[];
  onClick: () => void;
}

const themeIcons: Record<string, LucideIcon> = {
  'Emissions': Factory,
  'Energy': Zap,
  'Water': Droplets,
  'Waste / Recovery': Recycle,
  'Materials': Building2,
  'Sustainable Procurement': ShoppingBag,
  'Nature': TreePine,
  'Legacy': Leaf,
  'General': Leaf,
  'Resilience': Leaf
};

export function ThemeCard({ theme, initiatives, onClick }: ThemeCardProps) {
  const stats = {
    implemented: initiatives.filter(i => i.status === 'Implemented').length,
    total: initiatives.length
  };

  const Icon = themeIcons[theme] || Leaf;

  return (
    <button 
      onClick={onClick}
      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background-base rounded-lg"
    >
      <Card 
        className="p-4 transition-transform duration-200 hover:scale-[1.02]" 
        hover 
        glow
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
              <Icon className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{theme}</h3>
          </div>
          <div className="text-sm font-medium text-brand-primary">
            {stats.implemented}/{stats.total}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-primary transition-all duration-500"
              style={{ 
                width: `${(stats.implemented / stats.total) * 100}%` 
              }}
            />
          </div>
        </div>
      </Card>
    </button>
  );
}