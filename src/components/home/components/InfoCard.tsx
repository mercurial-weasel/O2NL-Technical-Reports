import React from 'react';
import { gradients } from '../../../constants/theme';
import { CardProps } from '../../../types/default';

export function InfoCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick, 
  comingSoon,
  enabled 
}: CardProps) {
  const CardWrapper = onClick && enabled ? 'button' : 'div';
  
  return (
    <CardWrapper
      onClick={enabled ? onClick : undefined}
      className={`group relative text-left h-[200px] ${
        enabled && onClick ? 'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background-base' : ''
      } rounded-lg ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Glowing border effect - only show for enabled cards */}
      {enabled && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
      )}
      
      {/* Card content */}
      <div className={`relative ${gradients.card} border border-border-primary rounded-lg p-5 transition-all duration-300 ${
        enabled ? 'group-hover:border-brand-primary/50' : 'border-gray-700/50'
      } h-full flex flex-col justify-between`}>
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2.5 rounded-lg ${
              enabled 
                ? 'bg-brand-primary/5 group-hover:bg-brand-primary/10' 
                : 'bg-gray-600/5'
              } transition-colors`}>
              <Icon className={`w-5 h-5 ${
                enabled ? 'text-brand-primary' : 'text-gray-500'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold ${
              enabled 
                ? 'text-text-primary group-hover:text-brand-primary' 
                : 'text-gray-500'
              } transition-colors`}>
              {title}
            </h3>
          </div>
          <p className={`text-sm ${
            enabled 
              ? 'text-text-secondary group-hover:text-text-primary' 
              : 'text-gray-500'
            } transition-colors leading-relaxed`}>
            {description}
          </p>
        </div>
        <div>
          <span className={`inline-flex items-center text-sm font-medium ${
            enabled ? 'text-brand-primary' : 'text-gray-500'
          }`}>
            {comingSoon ? (
              'Coming Soon'
            ) : enabled ? (
              <>
                View Dashboards
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              'Not Available'
            )}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}