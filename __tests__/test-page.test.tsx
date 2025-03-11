import { render, screen } from '@testing-library/react';
import TestPage from '../app/test/page';

// Mock the TestPageLayout component
jest.mock('../app/test/page-layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="test-page-layout">{children}</div>
    ),
  };
});

describe('Test Page', () => {
  it('renders the test page content within the custom layout', () => {
    // Act
    render(<TestPage />);
    
    // Assert
    // Check that the layout is used
    expect(screen.getByTestId('test-page-layout')).toBeInTheDocument();
    
    // Check content elements
    expect(screen.getByRole('heading', { name: /Test Page Content/i })).toBeInTheDocument();
    expect(screen.getByText(/This is a special test page with its own custom layout./i)).toBeInTheDocument();
    
    // Check test components
    expect(screen.getByRole('heading', { name: /Test Components/i })).toBeInTheDocument();
    expect(screen.getByText(/Test Component 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Component 2/i)).toBeInTheDocument();
  });
});