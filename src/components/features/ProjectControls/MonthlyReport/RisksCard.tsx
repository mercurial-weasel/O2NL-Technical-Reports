import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Card } from '@common/Card/Card';

interface Risk {
  description: string;
  likelihood: number;
  consequence: number;
}

interface RisksCardProps {
  risks: Risk[];
}

export function RisksCard({ risks }: RisksCardProps) {
  const [activeRisk, setActiveRisk] = useState<{ risk: Risk; x: number; y: number } | null>(null);
  const [helpTooltip, setHelpTooltip] = useState<{ x: number; y: number } | null>(null);

  const getRiskSeverity = (likelihood: number, consequence: number) => {
    const severity = likelihood * consequence;
    if (severity >= 16) return 'bg-red-500/20 text-red-500';
    if (severity >= 8) return 'bg-orange-500/20 text-orange-500';
    return 'bg-yellow-500/20 text-yellow-500';
  };

  return (
    <Card className="p-6" hover>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Key Risks</h2>
        <div 
          className="relative"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHelpTooltip({ x: rect.left, y: rect.top });
          }}
          onMouseLeave={() => setHelpTooltip(null)}
        >
          <HelpCircle className="w-5 h-5 text-text-secondary hover:text-text-primary cursor-help" />
          {helpTooltip && (
            <div 
              className="absolute z-50 w-80 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-xs"
              style={{
                top: '50%',
                right: '100%',
                transform: 'translateY(-50%)',
                marginRight: '10px',
              }}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-brand-primary mb-2">Rating Scales (1-5)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-text-primary font-medium mb-1">Likelihood</h5>
                      <ul className="space-y-1 text-text-secondary">
                        <li>1 - Rare</li>
                        <li>2 - Unlikely</li>
                        <li>3 - Possible</li>
                        <li>4 - Likely</li>
                        <li>5 - Almost Certain</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-text-primary font-medium mb-1">Consequence</h5>
                      <ul className="space-y-1 text-text-secondary">
                        <li>1 - Negligible</li>
                        <li>2 - Minor</li>
                        <li>3 - Moderate</li>
                        <li>4 - Major</li>
                        <li>5 - Severe</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-brand-primary mb-2">Overall Risk Rating</h4>
                  <p className="text-text-secondary mb-2">
                    Overall risk is calculated by multiplying Likelihood × Consequence
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-text-secondary">1-7: Low Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-text-secondary">8-15: Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-text-secondary">16-25: High Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setActiveRisk({ risk, x: rect.left, y: rect.top });
            }}
            onMouseLeave={() => setActiveRisk(null)}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getRiskSeverity(risk.likelihood, risk.consequence)} flex items-center justify-center`}>
              <span className="text-lg font-bold">{risk.likelihood * risk.consequence}</span>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary">{risk.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Details Tooltip */}
      {activeRisk && (
        <div 
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs"
          style={{
            top: `${activeRisk.y - 10}px`,
            left: `${activeRisk.x}px`,
            transform: 'translateY(-100%)',
            maxWidth: '300px'
          }}
        >
          <div className="space-y-2">
            <div className="font-medium text-brand-primary">Risk Details</div>
            <div className="grid gap-2">
              <div>
                <span className="text-text-secondary">Description:</span>
                <span className="ml-2 text-text-primary">{activeRisk.risk.description}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-secondary">Likelihood:</span>
                  <span className="ml-2 text-text-primary">{activeRisk.risk.likelihood}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Consequence:</span>
                  <span className="ml-2 text-text-primary">{activeRisk.risk.consequence}</span>
                </div>
              </div>
              <div>
                <span className="text-text-secondary">Overall Risk:</span>
                <span className="ml-2 text-text-primary">
                  {activeRisk.risk.likelihood * activeRisk.risk.consequence}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}