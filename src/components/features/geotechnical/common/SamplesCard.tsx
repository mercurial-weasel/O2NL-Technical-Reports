import React from 'react';
import { Button } from '@common/Button/Button';
import { Card } from '@common/Card/Card';

interface Sample {
  sample_id: string;
  sample_reference: string;
  point_id: string;
}

interface SamplesCardProps {
  samples: Sample[];
  selectedSampleIds: Set<string>;
  onSampleSelect: (sampleId: string) => void;
  onSampleDeselect: (sampleId: string) => void;
  onClearSelection: () => void;
}

export function SamplesCard({ 
  samples, 
  selectedSampleIds, 
  onSampleSelect, 
  onSampleDeselect, 
  onClearSelection 
}: SamplesCardProps) {
  return (
    <Card title="Samples" className="h-full">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{samples.length} samples</span>
          <Button 
            size="xs" 
            variant="ghost" 
            onClick={onClearSelection}
            disabled={selectedSampleIds.size === 0}
          >
            Clear
          </Button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {samples.map((sample) => {
            const isSelected = selectedSampleIds.has(sample.sample_id);
            return (
              <div 
                key={sample.sample_id}
                className={`p-1.5 text-xs flex justify-between items-center mb-1 rounded cursor-pointer ${
                  isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-100'
                }`}
                onClick={() => isSelected ? onSampleDeselect(sample.sample_id) : onSampleSelect(sample.sample_id)}
              >
                <span>{sample.sample_reference}</span>
                <span className="text-text-muted">{sample.point_id}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
