# Testing Guide

## Overview

This project uses Jest and React Testing Library for testing. Our testing strategy includes:

- Unit Tests: For individual components and utilities
- Integration Tests: For component interactions
- End-to-End Tests: For critical user flows

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

```
__tests__/
├── components/     # Component tests
├── pages/         # Page tests
├── utils/         # Utility function tests
└── integration/   # Integration tests
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import YourComponent from '@/components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import UserFlow from '@/components/UserFlow';

describe('UserFlow', () => {
  it('completes the user journey', async () => {
    render(<UserFlow />);
    await fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Use user-centric queries (getByRole, getByText) over test IDs

2. **Arrange-Act-Assert Pattern**
   ```typescript
   it('updates count when clicked', () => {
     // Arrange
     render(<Counter />);
     
     // Act
     fireEvent.click(screen.getByRole('button'));
     
     // Assert
     expect(screen.getByText('1')).toBeInTheDocument();
   });
   ```

3. **Mock External Dependencies**
   ```typescript
   jest.mock('next/router', () => ({
     useRouter() {
       return {
         push: jest.fn(),
       };
     },
   }));
   ```

4. **Test Edge Cases**
   - Empty states
   - Loading states
   - Error states
   - Boundary conditions

5. **Coverage Goals**
   - Aim for 80% coverage for critical paths
   - 100% coverage for utility functions
   - Focus on meaningful coverage over numbers

## Common Testing Patterns

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '@/hooks/useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

### Testing Forms
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form data', async () => {
  render(<Form />);
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.submit(screen.getByRole('button'));
  expect(screen.getByText('Submitted')).toBeInTheDocument();
});
```

### Testing API Calls
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: 'test' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Debugging Tests

1. **Debug Element**
   ```typescript
   screen.debug(element);
   ```

2. **Testing Playground**
   ```typescript
   import { screen } from '@testing-library/react';
   screen.logTestingPlaygroundURL();
   ```

3. **Jest Debug Mode**
   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand
   ```

## Continuous Integration

Tests are automatically run in CI/CD pipeline:
- On pull requests
- Before deployment
- Nightly for all branches

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 3. Architecture Vision Document Update

```markdown:c%3A%5CAIdev%5Ccc%5Ccc%5C-%20design%20documents%5Carchitecture-vision.md
# ConstituentCircle.com - Architecture Vision

## Technical Architecture

### Platform Foundation

#### Frontend Architecture

- **Next.js Framework**
  - Server-side rendering for optimal SEO
  - Static generation for content-heavy pages
  - Real-time updates via WebSocket connections
  - TypeScript integration for enhanced code quality
  - Tailwind CSS for responsive design
  - Component-based architecture for reusability

#### Backend Architecture

- **Convex Backend**
  - Real-time data synchronization
  - Serverless functions for business logic
  - TypeScript integration for type safety
  - Automatic API generation
  - Built-in authentication and authorization

#### Database Layer

- **Primary Storage**
  - Convex for real-time data synchronization and management
  - Redis for caching and session management
  - Structured data organization for constituent profiles

### Database Schema

#### Core Tables

- **profiles**: Links to Convex Auth users and stores role information
- **representatives**: Stores information about elected officials and their offices
- **constituents**: Manages constituent data and preferences
- **communications**: Tracks all interactions between representatives and constituents
- **groups**: Enables segmentation of constituents for targeted communications
- **group_members**: Junction table for many-to-many relationship between groups and constituents
- **analytics**: Stores aggregated metrics for reporting and insights

#### Security Features

- Function-level access control to ensure data access security
- Role-based permissions for representatives and constituents
- Secure authentication integration with Convex Auth

### Communication Infrastructure

#### Template Management

- Dynamic template generation
- Category-based organization
- Personalization tokens
- Version control

## Development and Operations

### DevOps Pipeline

- **Containerization**: Docker for consistent environments
- **Orchestration**: Kubernetes for deployment management
- **CI/CD**: GitHub Actions for automated workflows
- **Monitoring**: Prometheus and Grafana integration

## Business Model

### Value-Added Services

- Custom integration development
- Training and onboarding
- Communication strategy consulting
- Advanced analytics packages

## Implementation Roadmap

### Phase 2: Advanced Features (Q1 2025)

- Multi-channel support
- Advanced AI capabilities
- Analytics dashboard
- API development

### Phase 3: Enterprise Scaling (Q2 2025)

- Custom integrations
- Advanced security features
- Performance optimization
- Extended AI capabilities