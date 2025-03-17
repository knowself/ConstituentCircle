'use client';

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import '../styles/globals.css'; // Make sure to import global styles

// Initialize the Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // On page load or when changing themes, best to add inline in 'head' to avoid FOUC
              try {
                // Function to determine if dark mode should be active
                function shouldUseDarkMode(theme) {
                  return theme === 'dark' || 
                    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                }
                
                // Get theme from localStorage or use system default
                const theme = localStorage.getItem('theme') || 'system';
                const isDark = shouldUseDarkMode(theme);
                
                // Apply theme class to document
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(isDark ? 'dark' : 'light');
                
                // Listen for system preference changes if using system theme
                if (theme === 'system') {
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  const handleChange = () => {
                    const newIsDark = mediaQuery.matches;
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(newIsDark ? 'dark' : 'light');
                  };
                  
                  // Add listener for system preference changes
                  mediaQuery.addEventListener('change', handleChange);
                }

                // Add storage event listener to sync theme across tabs/pages
                window.addEventListener('storage', function(e) {
                  if (e.key === 'theme' && e.newValue) {
                    const newTheme = e.newValue;
                    const newIsDark = shouldUseDarkMode(newTheme);
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(newIsDark ? 'dark' : 'light');
                  }
                });
              } catch (e) {
                // If error, default to light mode
                console.error('Error setting theme:', e);
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
              }
            })()
          `
        }} />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ConvexProvider client={convex}>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}