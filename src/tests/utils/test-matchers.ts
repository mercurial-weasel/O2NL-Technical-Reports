import { expect } from 'vitest';

// Custom matchers for common test scenarios
expect.extend({
  toHaveErrorMessage(received: HTMLElement, expected: string) {
    const hasError = received.textContent?.includes(expected);
    return {
      pass: hasError,
      message: () =>
        `expected element to ${hasError ? 'not ' : ''}have error message "${expected}"`
    };
  },
  
  toBeValidDate(received: string) {
    const date = new Date(received);
    const isValid = !isNaN(date.getTime());
    return {
      pass: isValid,
      message: () =>
        `expected "${received}" to ${isValid ? 'not ' : ''}be a valid date`
    };
  },
  
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    return {
      pass,
      message: () =>
        `expected ${received} to ${pass ? 'not ' : ''}be within range ${min}-${max}`
    };
  }
});

declare global {
  namespace Vi {
    interface Assertion {
      toHaveErrorMessage(message: string): void;
      toBeValidDate(): void;
      toBeWithinRange(min: number, max: number): void;
    }
  }
}