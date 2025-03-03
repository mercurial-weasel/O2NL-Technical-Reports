import { SustainabilityRecords } from './types';


export const mockSustainabilityData: SustainabilityRecords = [
  {
    "id": "initiative 1-2025-03",
    "month": "2025-03",
    "discipline": "Initiative 1",
    "status": "green",
    "trend": "up",
    "keyIssue": "Planning refresh required",
    "keyRisks": [
      {
        "description": "No buy in from senior management",
        "category": "Unknown",
        "likelihood": 2,
        "consequence": 3
      },
      {
        "description": "Lack of resourcing",
        "category": "Unknown",
        "likelihood": 3,
        "consequence": 4
      },
      {
        "description": "Budget shortfall",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 2
      }
    ],
    "tasksToComplete": [
      {
        "description": "Secure buy in from management",
        "completion": 80,
        "status": "Delayed",
        "critical_path": true
      },
      {
        "description": "Onboard additional resource",
        "completion": 60,
        "status": "Delayed",
        "critical_path": false
      }
    ],
    "dependencies": [
      "Initiative 2"
    ],
    "kpis": [
      {
        "name": "# Stakeholders engaged",
        "target": 90,
        "actual": 85,
        "unit": "%",
        "trend": "up",
        "status": "green"
      },
      {
        "name": "# Stakeholders engaged",
        "target": 90,
        "actual": 85,
        "unit": "%",
        "trend": "up",
        "status": "green"
      }
    ],
    "metrics": {
      "staffUtilization": 0,
      "trainingCompletion": 0,
      "resourceGaps": 3
    },
    "lastUpdated": "2025-03-03T01:42:09.858351",
    "createdAt": "2025-03-03T01:42:09.858351"
  },
  {
    "id": "initiative 2-2025-03",
    "month": "2025-03",
    "discipline": "Initiative 2",
    "status": "orange",
    "trend": "up",
    "keyIssue": "Too much data",
    "keyRisks": [
      {
        "description": "Too much data overwhelms people",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 1
      }
    ],
    "tasksToComplete": [
      {
        "description": "Talk to data team about getting help",
        "completion": 0,
        "status": "unknown",
        "critical_path": false
      }
    ],
    "dependencies": [
      "Availabliltiy of data team"
    ],
    "kpis": [
      {
        "name": "Time spent processing data",
        "target": 90,
        "actual": 85,
        "unit": "%",
        "trend": "up",
        "status": "green"
      }
    ],
    "metrics": {
      "staffUtilization": 0,
      "trainingCompletion": 0,
      "resourceGaps": 1
    },
    "lastUpdated": "2025-03-03T01:42:09.861352",
    "createdAt": "2025-03-03T01:42:09.862352"
  }
];
