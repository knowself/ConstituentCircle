import { Analytics } from '@vercel/analytics/react';
import { inject } from '@vercel/analytics';

// Initialize analytics
inject();

// Analytics wrapper component
export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Custom event tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (window?.va) {
    window.va.track(eventName, properties);
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  trackEvent('page_view', { url });
};

// Conversion tracking
export const trackConversion = (type: string, value?: number) => {
  trackEvent('conversion', { type, value });
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string) => {
  trackEvent('feature_usage', { feature });
};

// Error tracking
export const trackError = (error: Error, context?: string) => {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    context,
  });
};
