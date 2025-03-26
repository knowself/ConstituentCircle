'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create context with default values to avoid the undefined check
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => null,
});

// Utility function to get the current theme
const getThemeFromStorage = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  
  try {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    return storedTheme || 'system';
  } catch (e) {
    return 'system';
  }
};

// Utility function to determine if dark mode should be active
const shouldUseDarkMode = (theme: Theme): boolean => {
  if (typeof window === 'undefined') return false;
  
  return theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  const isDark = shouldUseDarkMode(theme);
  
  // Remove both classes and then add the appropriate one
  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');

  // Dispatch a custom event that other parts of the app can listen for
  const event = new CustomEvent('themechange', { detail: { theme, isDark } });
  window.dispatchEvent(event);
};

// Create a global variable to track if the theme has been initialized
if (typeof window !== 'undefined' && !window.hasOwnProperty('__THEME_INITIALIZED__')) {
  Object.defineProperty(window, '__THEME_INITIALIZED__', {
    value: false,
    writable: true,
    configurable: true
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with the stored theme or system default
  const [theme, setTheme] = useState<Theme>(getThemeFromStorage());
  const [mounted, setMounted] = useState(false);

  // Apply theme when it changes
  const updateTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    const currentTheme = getThemeFromStorage();
    applyTheme(currentTheme);
    setTheme(currentTheme);

    // Mark as initialized
    if (typeof window !== 'undefined') {
      (window as any).__THEME_INITIALIZED__ = true;
    }

    // Listen for theme changes from other instances
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        applyTheme(newTheme);
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: updateTheme,
  };

  // Avoid hydration mismatch by not rendering context provider until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Standalone ThemeToggle component that doesn't rely on context
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    // Add observer to detect theme changes from other components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setIsDark(isDarkMode);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    // Listen for custom theme change events
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);
  
  const toggleTheme = () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? 'dark' : 'light';
    
    // Apply theme
    applyTheme(newTheme);
    
    // Save to localStorage with consistent key
    localStorage.setItem('theme', newTheme);
    
    setIsDark(newIsDark);
  };
  
  if (!mounted) return null;
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}
