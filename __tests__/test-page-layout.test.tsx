import { render, screen } from '@testing-library/react';
import TestPageLayout from '../app/test/page-layout';

describe('TestPageLayout', () => {
  it('renders the header, main content, and footer for test page', () => {
    // Arrange
    const testContent = 'Test Content';
    
    // Act
    render(
      <TestPageLayout>
        <div data-testid="test-page-content">{testContent}</div>
      </TestPageLayout>
    );
    
    // Assert
    // Check header
    expect(screen.getByRole('heading', { name: /Test Page/i })).toBeInTheDocument();
    expect(screen.getByText(/Special test environment/i)).toBeInTheDocument();
    
    // Check main content
    const pageContent = screen.getByTestId('test-page-content');
    expect(pageContent).toBeInTheDocument();
    expect(pageContent).toHaveTextContent(testContent);
    
    // Check footer
    expect(screen.getByText(/Test Page Environment - For Testing Purposes Only/i)).toBeInTheDocument();
  });
});