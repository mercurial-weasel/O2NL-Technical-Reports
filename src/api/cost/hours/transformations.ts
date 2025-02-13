import { TimeLogEntry, HoursPivot } from './types';

interface TransformedHoursPivot {
  data: HoursPivot;
  metadata: {
    statuses: string[];
    monthYears: string[];
  };
}

export function transformToHoursPivot(entries: TimeLogEntry[]): TransformedHoursPivot {
  try {
    const pivotedData: HoursPivot = {};
    const statuses = new Set<string>();
    const monthYears = new Set<string>();

    // Process each entry
    entries.forEach(entry => {
      // Initialize nested objects if they don't exist
      if (!pivotedData[entry.projectName]) {
        pivotedData[entry.projectName] = {};
      }
      if (!pivotedData[entry.projectName][entry.taskName]) {
        pivotedData[entry.projectName][entry.taskName] = {};
      }
      if (!pivotedData[entry.projectName][entry.taskName][entry.userName]) {
        pivotedData[entry.projectName][entry.taskName][entry.userName] = {};
      }

      // Extract status and month-year combinations from dynamic columns
      Object.entries(entry).forEach(([key, value]) => {
        if (typeof value === 'number' && key.includes('_')) {
          const [status, monthYear] = key.split('_');
          
          // Add to metadata sets
          statuses.add(status);
          monthYears.add(monthYear);

          // Initialize status object if it doesn't exist
          if (!pivotedData[entry.projectName][entry.taskName][entry.userName][status]) {
            pivotedData[entry.projectName][entry.taskName][entry.userName][status] = {};
          }

          // Add hours value
          pivotedData[entry.projectName][entry.taskName][entry.userName][status][monthYear] = value;
        }
      });
    });

    return {
      data: pivotedData,
      metadata: {
        statuses: Array.from(statuses).sort(),
        monthYears: Array.from(monthYears).sort()
      }
    };
  } catch (error) {
    throw new Error(`Failed to transform hours data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to validate TimeLogEntry data
export function validateTimeLogEntry(entry: any): entry is TimeLogEntry {
  if (!entry || typeof entry !== 'object') return false;
  
  // Check required string fields
  if (typeof entry.projectName !== 'string' ||
      typeof entry.taskName !== 'string' ||
      typeof entry.userName !== 'string') {
    return false;
  }

  // Check that at least one status_monthYear column exists with a number value
  const hasValidStatusColumn = Object.entries(entry).some(([key, value]) => {
    return key.includes('_') && typeof value === 'number';
  });

  return hasValidStatusColumn;
}

// Helper function to extract month-year from column name
export function extractMonthYear(columnName: string): string | null {
  const match = columnName.match(/_(\d{4}-\d{2})$/);
  return match ? match[1] : null;
}

// Helper function to extract status from column name
export function extractStatus(columnName: string): string | null {
  const match = columnName.match(/^([^_]+)_/);
  return match ? match[1] : null;
}