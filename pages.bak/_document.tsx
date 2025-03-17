import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          <script
            dangerouslySetInnerHTML={{
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

                    // Dispatch event to notify theme is ready
                    window.dispatchEvent(new CustomEvent('theme-initialized'));
                  } catch (e) {
                    // If error, default to light mode
                    console.error('Error setting theme:', e);
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                })()
              `
            }}
          />
        </Head>
        <body className="h-full bg-gray-50 dark:bg-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
