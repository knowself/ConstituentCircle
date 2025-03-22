// Global type definitions for the application

// Add the ENV property to the Window interface
interface Window {
  ENV?: {
    NEXT_PUBLIC_CONVEX_URL?: string;
    [key: string]: string | undefined;
  };
}
