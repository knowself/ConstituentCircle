/**
 * Loading Component
 * 
 * A reusable loading spinner component that provides visual feedback during
 * asynchronous operations. Supports different sizes and custom loading messages.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Loading />
 * 
 * // Custom size and message
 * <Loading size="large" message="Fetching data..." />
 * ```
 */

import React from 'react';

interface LoadingProps {
  /** Size of the loading spinner */
  size?: 'small' | 'medium' | 'large';
  /** Custom message to display below the spinner */
  message?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Size configuration for the loading spinner
 */
const sizeClasses = {
  small: 'w-6 h-6 border-2',
  medium: 'w-10 h-10 border-3',
  large: 'w-16 h-16 border-4'
};

/**
 * Loading component that displays a spinning animation with optional message
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  message = 'Loading...',
  className = '',
  ariaLabel = 'Loading content'
}) => {
  return (
    <div 
      role="status"
      aria-label={ariaLabel}
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <div
        className={`
          animate-spin
          rounded-full
          border-primary
          border-t-transparent
          ${sizeClasses[size]}
        `}
        aria-hidden="true"
      />
      {message && (
        <p className="mt-2 text-gray-600 dark:text-gray-300" aria-live="polite">
          {message}
        </p>
      )}
      {/* Visually hidden text for screen readers */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

/**
 * LoadingOverlay component that covers its parent container
 */
export const LoadingOverlay: React.FC<LoadingProps> = (props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-gray-900/75">
      <Loading {...props} />
    </div>
  );
};

export default Loading;
