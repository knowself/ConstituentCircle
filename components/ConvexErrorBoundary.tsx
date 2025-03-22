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

/**
 * Error boundary component that catches errors from Convex hooks
 * and displays a fallback UI instead of crashing the entire app
 */
export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ConvexErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h2 className="text-lg font-semibold">Something went wrong with Convex</h2>
          <p className="mt-2">{this.state.error?.message}</p>
          <p className="mt-4 text-sm text-gray-600">
            This is likely due to a Convex client initialization issue. 
            Please check your console for more details.
          </p>
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
