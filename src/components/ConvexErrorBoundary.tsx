'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ConvexErrorBoundary caught an error:', error);
    // You can add error reporting service here
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h2 className="text-lg font-semibold">Connection Error</h2>
          <p className="mt-2">{this.state.error?.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component for Convex hooks that provides a fallback UI
 * when Convex is not available
 */
export function ConvexSafeComponent({ 
  children, 
  fallback 
}: Props): ReactNode {
  return (
    <ConvexErrorBoundary fallback={fallback}>
      {children}
    </ConvexErrorBoundary>
  );
}
