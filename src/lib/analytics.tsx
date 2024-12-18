import React from 'react';
import { Analytics } from '@vercel/analytics/react';

// Analytics wrapper component
export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Initialize analytics
export function initAnalytics() {
  if (typeof window !== 'undefined') {
    import('@vercel/analytics').then(({ inject }) => inject());
  }
}

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    import('@vercel/analytics').then(({ track }) => {
      track(eventName, properties);
    });
  }
};
