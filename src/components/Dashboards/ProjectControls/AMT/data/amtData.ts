import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export interface AMTItem {
  id: string;
  title: string;
  status: 'green' | 'orange' | 'red';
  trend: 'up' | 'down' | 'unchanged';
  keyIssue: string;
  keyRisks: { description: string, likelihood: number, consequence: number }[];
  tasksToComplete: { description: string, completion: number, status: string, critical_path: boolean }[];
  dependencies: string[];
}

export const amtData: { [key: string]: AMTItem[] } = {
  "November 2024": [
    {
      id: 'people-ops',
      title: 'People & Operational Performance',
      status: 'orange',
      trend: 'up',
      keyIssue: 'Planning refresh required',
      keyRisks: [
        { description: "Skill gaps in specialized roles", likelihood: 4, consequence: 3 },
        { description: "High turnover in key positions", likelihood: 3, consequence: 3 },
        { description: "Training program delays", likelihood: 3, consequence: 2 },
        { description: "Resource availability conflicts", likelihood: 5, consequence: 1 }
      ],
      tasksToComplete: [
        { description: 'Complete Q1 performance reviews', completion: 40, status: 'on track', critical_path: true },
        { description: 'Launch leadership development program', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Implement new resource tracking system', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Finalize succession plans', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'HR system upgrade completion',
        'Budget approval for training',
        'Department head availability',
        'IT system integration'
      ]
    },
    {
      id: 'legacy',
      title: 'Legacy Outcomes',
      status: 'orange',
      trend: 'unchanged',
      keyIssue: 'Community engagement initiatives require enhancement',
      keyRisks: [
        { description: 'Stakeholder expectations misalignment', likelihood: 4, consequence: 3 },
        { description: 'Funding constraints for legacy projects', likelihood: 4, consequence: 3 },
        { description: 'Resource allocation conflicts', likelihood: 4, consequence: 3 },
        { description: 'Timeline pressures', likelihood: 4, consequence: 3 }
      ],
      tasksToComplete: [
        { description: 'Develop community feedback framework', completion: 40, status: 'on track', critical_path: true },
        { description: 'Complete impact assessment report', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Launch community outreach program', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Update legacy documentation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Stakeholder approval',
        'Resource availability',
        'Community participation',
        'Budget allocation'
      ]
    },
    {
      id: 'kaiārahi',
      title: 'Interim Kaiārahi',
      status: 'orange',
      trend: 'up',
      keyIssue: 'Integration of cultural considerations in project delivery',
      keyRisks: [
        { description: 'Cultural alignment challenges', likelihood: 2, consequence: 4 },
        { description: 'Communication barriers', likelihood: 3, consequence: 3 },
        { description: 'Resource availability', likelihood: 4, consequence: 2 },
        { description: 'Timeline constraints', likelihood: 3, consequence: 4 }
      ],
      tasksToComplete: [
        { description: 'Cultural awareness training rollout', completion: 40, status: 'on track', critical_path: true },
        { description: 'Stakeholder engagement plan update', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Cultural advisory board establishment', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Integration framework development', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Cultural advisor availability',
        'Stakeholder participation',
        'Resource allocation',
        'Management support'
      ]
    },
    {
      id: 'env-planning',
      title: 'Environment + Planning',
      status: 'orange',
      trend: 'down',
      keyIssue: 'Environmental compliance requirements increasing',
      keyRisks: [
        { description: 'Regulatory changes impact', likelihood: 4, consequence: 5 },
        { description: 'Weather-related delays', likelihood: 3, consequence: 4 },
        { description: 'Resource constraints', likelihood: 2, consequence: 3 },
        { description: 'Stakeholder concerns', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Update environmental management plan', completion: 40, status: 'on track', critical_path: true },
        { description: 'Complete compliance audit', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Implement monitoring system', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Stakeholder consultation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Regulatory approval',
        'Weather conditions',
        'Resource availability',
        'Technical system readiness'
      ]
    },
    {
      id: 'design',
      title: 'Design',
      status: 'green',
      trend: 'unchanged',
      keyIssue: 'Design optimization opportunities identified',
      keyRisks: [
        { description: 'Technical complexity challenges', likelihood: 3, consequence: 4 },
        { description: 'Resource availability', likelihood: 4, consequence: 3 },
        { description: 'Integration issues', likelihood: 2, consequence: 5 },
        { description: 'Timeline pressure', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Complete design review', completion: 90, status: 'on track', critical_path: true },
        { description: 'Update technical specifications', completion: 95, status: 'at risk', critical_path: false },
        { description: 'Coordinate with stakeholders', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Finalize design documentation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical approval',
        'Resource allocation',
        'Stakeholder input',
        'System compatibility'
      ]
    },
    {
      id: 'construction',
      title: 'Construction',
      status: 'red',
      trend: 'down',
      keyIssue: 'Schedule delays impacting critical path',
      keyRisks: [
        { description: 'Weather-related delays', likelihood: 4, consequence: 5 },
        { description: 'Resource constraints', likelihood: 3, consequence: 4 },
        { description: 'Supply chain issues', likelihood: 2, consequence: 3 },
        { description: 'Quality concerns', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Update construction schedule', completion: 40, status: 'on track', critical_path: true },
        { description: 'Resource reallocation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Quality assurance review', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Risk mitigation planning', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Weather conditions',
        'Resource availability',
        'Material delivery',
        'Subcontractor coordination'
      ]
    },
    {
      id: 'engineering',
      title: 'Engineering, Systems and Sustainability',
      status: 'green',
      trend: 'up',
      keyIssue: 'System integration optimization required',
      keyRisks: [
        { description: 'Technical complexity', likelihood: 3, consequence: 4 },
        { description: 'Resource availability', likelihood: 4, consequence: 3 },
        { description: 'Integration challenges', likelihood: 2, consequence: 5 },
        { description: 'Performance issues', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'System performance review', completion: 40, status: 'on track', critical_path: true },
        { description: 'Integration testing', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Documentation update', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Training program development', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical resources',
        'System availability',
        'User acceptance',
        'Training completion'
      ]
    },
    {
      id: 'commercial',
      title: 'Commercial',
      status: 'orange',
      trend: 'down',
      keyIssue: 'Cost pressures affecting project margins',
      keyRisks: [
        { description: 'Market price fluctuations', likelihood: 4, consequence: 5 },
        { description: 'Contract variations', likelihood: 3, consequence: 4 },
        { description: 'Payment delays', likelihood: 2, consequence: 3 },
        { description: 'Resource cost increases', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Cost analysis review', completion: 40, status: 'on track', critical_path: true },
        { description: 'Contract negotiation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Budget reforecast', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Risk mitigation planning', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Stakeholder approval',
        'Market conditions',
        'Resource availability',
        'Contract finalization'
      ]
    },
    {
      id: 'oim',
      title: 'OIM Update',
      status: 'green',
      trend: 'unchanged',
      keyIssue: 'System updates pending implementation',
      keyRisks: [
        { description: 'Technical integration issues', likelihood: 3, consequence: 4 },
        { description: 'User adoption challenges', likelihood: 4, consequence: 3 },
        { description: 'Resource constraints', likelihood: 2, consequence: 5 },
        { description: 'Timeline pressure', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'System update planning', completion: 40, status: 'on track', critical_path: true },
        { description: 'User training preparation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Documentation update', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Testing schedule finalization', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical readiness',
        'Resource availability',
        'User availability',
        'System stability'
      ]
    }
  ],
  "January 2025": [
    {
      id: 'people-ops',
      title: 'People & Operational Performance',
      status: 'green',
      trend: 'up',
      keyIssue: 'Resource optimization needed for upcoming project phases',
      keyRisks: [
        { description: 'Skill gaps in specialized roles', likelihood: 4, consequence: 3 },
        { description: 'High turnover in key positions', likelihood: 3, consequence: 3 },
        { description: 'Training program delays', likelihood: 3, consequence: 2 },
        { description: 'Resource availability conflicts', likelihood: 5, consequence: 1 }
      ],
      tasksToComplete: [
        { description: 'Complete Q1 performance reviews', completion: 40, status: 'on track', critical_path: true },
        { description: 'Launch leadership development program', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Implement new resource tracking system', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Finalize succession plans', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'HR system upgrade completion',
        'Budget approval for training',
        'Department head availability',
        'IT system integration'
      ]
    },
    {
      id: 'legacy',
      title: 'Legacy Outcomes',
      status: 'orange',
      trend: 'unchanged',
      keyIssue: 'Community engagement initiatives require enhancement',
      keyRisks: [
        { description: 'Stakeholder expectations misalignment', likelihood: 4, consequence: 3 },
        { description: 'Funding constraints for legacy projects', likelihood: 4, consequence: 3 },
        { description: 'Resource allocation conflicts', likelihood: 4, consequence: 3 },
        { description: 'Timeline pressures', likelihood: 4, consequence: 3 }
      ],
      tasksToComplete: [
        { description: 'Develop community feedback framework', completion: 40, status: 'on track', critical_path: true },
        { description: 'Complete impact assessment report', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Launch community outreach program', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Update legacy documentation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Stakeholder approval',
        'Resource availability',
        'Community participation',
        'Budget allocation'
      ]
    },
    {
      id: 'kaiārahi',
      title: 'Interim Kaiārahi',
      status: 'green',
      trend: 'up',
      keyIssue: 'Integration of cultural considerations in project delivery',
      keyRisks: [
        { description: 'Cultural alignment challenges', likelihood: 2, consequence: 4 },
        { description: 'Communication barriers', likelihood: 3, consequence: 3 },
        { description: 'Resource availability', likelihood: 4, consequence: 2 },
        { description: 'Timeline constraints', likelihood: 3, consequence: 4 }
      ],
      tasksToComplete: [
        { description: 'Cultural awareness training rollout', completion: 40, status: 'on track', critical_path: true },
        { description: 'Stakeholder engagement plan update', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Cultural advisory board establishment', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Integration framework development', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Cultural advisor availability',
        'Stakeholder participation',
        'Resource allocation',
        'Management support'
      ]
    },
    {
      id: 'env-planning',
      title: 'Environment + Planning',
      status: 'orange',
      trend: 'down',
      keyIssue: 'Environmental compliance requirements increasing',
      keyRisks: [
        { description: 'Regulatory changes impact', likelihood: 4, consequence: 5 },
        { description: 'Weather-related delays', likelihood: 3, consequence: 4 },
        { description: 'Resource constraints', likelihood: 2, consequence: 3 },
        { description: 'Stakeholder concerns', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Update environmental management plan', completion: 40, status: 'on track', critical_path: true },
        { description: 'Complete compliance audit', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Implement monitoring system', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Stakeholder consultation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Regulatory approval',
        'Weather conditions',
        'Resource availability',
        'Technical system readiness'
      ]
    },
    {
      id: 'design',
      title: 'Design',
      status: 'green',
      trend: 'unchanged',
      keyIssue: 'Design optimization opportunities identified',
      keyRisks: [
        { description: 'Technical complexity challenges', likelihood: 3, consequence: 4 },
        { description: 'Resource availability', likelihood: 4, consequence: 3 },
        { description: 'Integration issues', likelihood: 2, consequence: 5 },
        { description: 'Timeline pressure', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Complete design review', completion: 40, status: 'on track', critical_path: true },
        { description: 'Update technical specifications', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Coordinate with stakeholders', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Finalize design documentation', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical approval',
        'Resource allocation',
        'Stakeholder input',
        'System compatibility'
      ]
    },
    {
      id: 'construction',
      title: 'Construction',
      status: 'red',
      trend: 'down',
      keyIssue: 'Schedule delays impacting critical path',
      keyRisks: [
        { description: 'Weather-related delays', likelihood: 4, consequence: 5 },
        { description: 'Resource constraints', likelihood: 3, consequence: 4 },
        { description: 'Supply chain issues', likelihood: 2, consequence: 3 },
        { description: 'Quality concerns', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Update construction schedule', completion: 40, status: 'on track', critical_path: true },
        { description: 'Resource reallocation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Quality assurance review', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Risk mitigation planning', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Weather conditions',
        'Resource availability',
        'Material delivery',
        'Subcontractor coordination'
      ]
    },
    {
      id: 'engineering',
      title: 'Engineering, Systems and Sustainability',
      status: 'green',
      trend: 'up',
      keyIssue: 'System integration optimization required',
      keyRisks: [
        { description: 'Technical complexity', likelihood: 3, consequence: 4 },
        { description: 'Resource availability', likelihood: 4, consequence: 3 },
        { description: 'Integration challenges', likelihood: 2, consequence: 5 },
        { description: 'Performance issues', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'System performance review', completion: 40, status: 'on track', critical_path: true },
        { description: 'Integration testing', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Documentation update', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Training program development', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical resources',
        'System availability',
        'User acceptance',
        'Training completion'
      ]
    },
    {
      id: 'commercial',
      title: 'Commercial',
      status: 'orange',
      trend: 'down',
      keyIssue: 'Cost pressures affecting project margins',
      keyRisks: [
        { description: 'Market price fluctuations', likelihood: 4, consequence: 5 },
        { description: 'Contract variations', likelihood: 3, consequence: 4 },
        { description: 'Payment delays', likelihood: 2, consequence: 3 },
        { description: 'Resource cost increases', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'Cost analysis review', completion: 40, status: 'on track', critical_path: true },
        { description: 'Contract negotiation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Budget reforecast', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Risk mitigation planning', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Stakeholder approval',
        'Market conditions',
        'Resource availability',
        'Contract finalization'
      ]
    },
    {
      id: 'oim',
      title: 'OIM Update',
      status: 'green',
      trend: 'unchanged',
      keyIssue: 'System updates pending implementation',
      keyRisks: [
        { description: 'Technical integration issues', likelihood: 3, consequence: 4 },
        { description: 'User adoption challenges', likelihood: 4, consequence: 3 },
        { description: 'Resource constraints', likelihood: 2, consequence: 5 },
        { description: 'Timeline pressure', likelihood: 5, consequence: 2 }
      ],
      tasksToComplete: [
        { description: 'System update planning', completion: 40, status: 'on track', critical_path: true },
        { description: 'User training preparation', completion: 60, status: 'at risk', critical_path: false },
        { description: 'Documentation update', completion: 25, status: 'delayed', critical_path: true },
        { description: 'Testing schedule finalization', completion: 50, status: 'on track', critical_path: false }
      ],
      dependencies: [
        'Technical readiness',
        'Resource availability',
        'User availability',
        'System stability'
      ]
    }
  ]
};