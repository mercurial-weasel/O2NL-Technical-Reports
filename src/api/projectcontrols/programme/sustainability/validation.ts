import { SustainabilityMonthlyRecordSchema, SustainabilityRecordsSchema } from './types';

export function validateMonthlyRecord(record: unknown) {
  return SustainabilityMonthlyRecordSchema.safeParse(record);
}

export function validateRecords(records: unknown) {
  return SustainabilityRecordsSchema.safeParse(records);
}

export function validateUniqueMonths(records: unknown[]) {
  const months = new Set<string>();
  let isValid = true;
  let duplicateMonth: string | null = null;

  for (const record of records) {
    if ('month' in record && typeof record.month === 'string') {
      if (months.has(record.month)) {
        isValid = false;
        duplicateMonth = record.month;
        break;
      }
      months.add(record.month);
    }
  }

  return {
    isValid,
    duplicateMonth,
    message: duplicateMonth ? `Duplicate month found: ${duplicateMonth}` : 'All months are unique'
  };
}

export function validateMetricRanges(record: unknown) {
  if (!record || typeof record !== 'object') return false;

  const validations = {
    'likelihood': { min: 1, max: 5 },
    'consequence': { min: 1, max: 5 },
    'completion': { min: 0, max: 100 }
  };

  let isValid = true;
  const errors: string[] = [];

  // Helper function to validate number range
  const validateRange = (value: number, min: number, max: number, field: string) => {
    if (value < min || value > max) {
      isValid = false;
      errors.push(`${field} must be between ${min} and ${max}`);
    }
  };

  // Validate risks
  if ('keyRisks' in record && Array.isArray(record.keyRisks)) {
    record.keyRisks.forEach((risk: any, index: number) => {
      if (risk.likelihood) {
        validateRange(risk.likelihood, 1, 5, `Risk ${index + 1} likelihood`);
      }
      if (risk.consequence) {
        validateRange(risk.consequence, 1, 5, `Risk ${index + 1} consequence`);
      }
    });
  }

  // Validate tasks
  if ('tasksToComplete' in record && Array.isArray(record.tasksToComplete)) {
    record.tasksToComplete.forEach((task: any, index: number) => {
      if (task.completion) {
        validateRange(task.completion, 0, 100, `Task ${index + 1} completion`);
      }
    });
  }

  return {
    isValid,
    errors
  };
}