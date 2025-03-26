/**
 * SEO Component
 * 
 * Handles meta tags, Open Graph, and Twitter card optimization for better search engine visibility
 * and social media sharing. This component should be used in every page component.
 * 
 * @component
 * @example
 * ```tsx
 * <SEO 
 *   title="Home"
 *   description="Welcome to AI Constituent Circle"
 *   image="/og-image.jpg"
 * />
 * ```
 */

import Head from 'next/head';
import React from 'react';

interface SEOProps {
  /** Page title - will be appended with site name */
  title?: string;
  /** Page description for meta tags */
  description?: string;
  /** URL for the OpenGraph image */
  image?: string;
  /** Current page URL */
  url?: string;
  /** OpenGraph type (website, article, etc.) */
  type?: string;
}

/**
 * SEO component for managing all meta tags and social sharing cards
 */
const SEO: React.FC<SEOProps> = ({
  title = 'AI Constituent Circle',
  description = 'AI-enabled tools for effective, opinionated, goal-oriented communications between representatives and constituents.',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website'
}) => {
  const siteTitle = `${title} | AI Constituent Circle`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#1F3A5F" />
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteTitle,
            description: description,
            url: url,
          }),
        }}
      />
    </Head>
  );
};

export default SEO;