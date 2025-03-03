# Testing Documentation

This directory contains all tests for the O2NL Data Intelligence application.

## Test Categories

### Unit Tests (`/unit`)
Individual component and function tests in isolation:
- Authentication system
- API clients
- Utility functions
- Custom hooks
- Components
- Data transformations

### Integration Tests (`/integration`)
Tests for multiple components working together:
- Authentication flows
- API integrations
- Route protection
- Data flow
- State management

### End-to-End Tests (`/e2e`)
Complete user flow and system tests:
- User flows
- Critical paths
- Error scenarios
- Performance tests

## Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Utilities

Common test utilities can be found in `/tests/utils/`:
- `test-utils.tsx` - Custom render function with providers
- `mock-data.ts` - Common mock data
- `test-ids.ts` - Common test IDs
- `test-matchers.ts` - Custom test matchers

## Fixtures

Reusable test fixtures are located in `/tests/fixtures/`:
- `auth.ts` - Authentication fixtures
- `api.ts` - API response fixtures
- `routes.ts` - Route fixtures
- `components.tsx` - Component fixtures
- `providers.tsx` - Test providers