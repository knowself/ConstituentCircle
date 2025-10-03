import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

type AnalyticsEventProps = Record<string, string | number | boolean | null | undefined>;

export function AnalyticsWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

export function initAnalytics() {
  if (typeof window !== "undefined") {
    void import("@vercel/analytics").then(({ inject }) => inject());
  }
}

export function trackEvent(eventName: string, properties?: AnalyticsEventProps) {
  if (typeof window !== "undefined") {
    void import("@vercel/analytics").then(({ track }) => {
      track(eventName, properties);
    });
  }
}
