import React from 'react';
import { Section } from '@common';
import { InfoCard } from './InfoCard';
import { CARDS } from '@constants/default';

interface InfoCardsProps {
  onGeotechnicalClick: () => void;
  onEnvironmentalClick: () => void;
  onProjectControlsClick: () => void;
}

export function InfoCards({ onGeotechnicalClick, onEnvironmentalClick, onProjectControlsClick }: InfoCardsProps) {
  return (
    <Section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((card) => (
          <InfoCard
            key={card.id}
            {...card}
            onClick={
              card.id === 'geotechnical' 
                ? onGeotechnicalClick 
                : card.id === 'environmental'
                  ? onEnvironmentalClick
                  : card.id === 'project-controls'
                    ? onProjectControlsClick
                    : undefined
            }
          />
        ))}
      </div>
    </Section>
  );
}