import { AMTRecords } from './types';

export const mockAMTData: AMTRecords = [
  {
    "id": "amt-2025-02",
    "month": "2025-02",
    "discipline": "AMT",
    "status": "green",
    "trend": "up",
    "keyIssue": "Planning refresh required",
    "keyRisks": [
      {
        "description": "Skill gaps in specialized roles",
        "category": "Unknown",
        "likelihood": 2,
        "consequence": 3
      },
      {
        "description": "High turnover in key positions",
        "category": "Unknown",
        "likelihood": 3,
        "consequence": 4
      },
      {
        "description": "Training program delays",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 2
      },
      {
        "description": "Resource availability conflicts",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 1
      }
    ],
    "tasksToComplete": [
      {
        "description": "Complete Q1 performance reviews',",
        "completion": 80,
        "status": "Delayed",
        "critical_path": true
      },
      {
        "description": "Launch leadership development program",
        "completion": 60,
        "status": "Delayed",
        "critical_path": false
      },
      {
        "description": "Implement new resource tracking system'",
        "completion": 40,
        "status": "Delayed",
        "critical_path": false
      },
      {
        "description": "inalize",
        "completion": 20,
        "status": "Delayed",
        "critical_path": false
      }
    ],
    "dependencies": [
      "HR system upgrade completion",
      "Budget approval for training",
      "Department head availability",
      "IT system integration"
    ],
    "kpis": [
      {
        "name": "Staff Utilization",
        "target": 90,
        "actual": 85,
        "unit": "%",
        "trend": "up",
        "status": "green"
      },
      {
        "name": "Training Completion",
        "target": 100,
        "actual": 75,
        "unit": "%",
        "trend": "up",
        "status": "orange"
      }
    ],
    "metrics": {
      "staffUtilization": 85,
      "trainingCompletion": 75,
      "resourceGaps": 4
    },
    "lastUpdated": "2025-02-12T09:19:40.802188",
    "createdAt": "2025-02-12T09:19:40.802188"
  },
  {
    "id": "design-2025-02",
    "month": "2025-02",
    "discipline": "Design",
    "status": "orange",
    "trend": "up",
    "keyIssue": "More designers required. ",
    "keyRisks": [
      {
        "description": "Bruno leaving",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 1
      },
      {
        "description": "Looming dates",
        "category": "Unknown",
        "likelihood": 3,
        "consequence": 3
      },
      {
        "description": "Upcoming stuff",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 2
      },
      {
        "description": "yar yar",
        "category": "Unknown",
        "likelihood": 1,
        "consequence": 5
      }
    ],
    "tasksToComplete": [
      {
        "description": "Task",
        "completion": 100,
        "status": "unknown",
        "critical_path": false
      },
      {
        "description": "Tasl2",
        "completion": 20,
        "status": "unknown",
        "critical_path": false
      },
      {
        "description": "task 3",
        "completion": 40,
        "status": "delayed",
        "critical_path": true
      },
      {
        "description": "Task 4",
        "completion": 60,
        "status": "unknown",
        "critical_path": false
      }
    ],
    "dependencies": [
      "Depencenice 1",
      "Depencenice 2",
      "Depencenice 3",
      "Depencenice 4"
    ],
    "kpis": [
      {
        "name": "Staff Utilization",
        "target": 90,
        "actual": 85,
        "unit": "%",
        "trend": "up",
        "status": "green"
      },
      {
        "name": "Training Completion",
        "target": 100,
        "actual": 75,
        "unit": "%",
        "trend": "up",
        "status": "orange"
      }
    ],
    "metrics": {
      "staffUtilization": 85,
      "trainingCompletion": 75,
      "resourceGaps": 4
    },
    "lastUpdated": "2025-02-12T09:19:40.805187",
    "createdAt": "2025-02-12T09:19:40.805187"
  }
];