// Type definitions for global objects

declare global {
  interface Window {
    ENV?: {
      CONVEX_URL?: string;
      [key: string]: any;
    };
    __CONVEX_STATE?: {
      client?: any;
      auth?: any;
      [key: string]: any;
    };
  }
}

export {}; // This file needs to be a module
