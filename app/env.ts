declare global {
  interface Window {
    ENV?: {
      NEXT_PUBLIC_CONVEX_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

export {};
