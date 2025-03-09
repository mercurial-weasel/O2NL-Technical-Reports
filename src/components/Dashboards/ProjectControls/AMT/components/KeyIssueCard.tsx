import React, { useState } from 'react';
import { Card } from '../../../../common/Card/Card';

interface KeyIssueCardProps {
  issue: string;
}

export function KeyIssueCard({ issue }: KeyIssueCardProps) {
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number } | null>(null);

  return (
    <Card 
      className="p-6" 
      hover
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setShowTooltip({ x: rect.left, y: rect.top });
      }}
      onMouseLeave={() => setShowTooltip(null)}
    >
      <h2 className="text-xl font-semibold text-text-primary mb-4">Key Issue</h2>
      <p className="text-text-secondary">{issue}</p>

      {/* Issue Tooltip */}
      {showTooltip && (
        <div 
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs"
          style={{
            top: `${showTooltip.y - 10}px`,
            left: `${showTooltip.x}px`,
            transform: 'translateY(-100%)',
            maxWidth: '300px'
          }}
        >
          <div className="space-y-2">
            <div className="font-medium text-brand-primary">Key Issue Details</div>
            <p className="text-text-primary">{issue}</p>
          </div>
        </div>
      )}
    </Card>
  );
}