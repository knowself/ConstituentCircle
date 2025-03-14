/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: [],
    unoptimized: false,
  },
  // Configure webpack for proper hot reload and CSS handling
  webpack: (config, { dev, isServer }) => {
    // Ensure proper module resolution and factory initialization
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        crypto: false
      }
    };

    // Configure module with proper initialization
    config.module = {
      ...config.module,
      parser: {
        javascript: {
          commonjsRequire: true
        }
      }
    };

    // Add loader options plugin for factory configuration
    if (!config.plugins) {
      config.plugins = [];
    }
    
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        options: {
          webpackFactory: true
        }
      })
    );


    // Configure module rules
    if (config.module?.rules) {
      const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        ?.oneOf?.filter((rule) => Array.isArray(rule.use));

      rules?.forEach((rule) => {
        rule.use?.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader') &&
            !moduleLoader.loader?.includes('postcss-loader')
          ) {
            moduleLoader.options = {
              ...moduleLoader.options,
              modules: false // Disable CSS modules for global CSS files
            };
          }
        });
      });
    }

    return config;
  },
}

module.exports = nextConfig
