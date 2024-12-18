export const defaultSEO = {
  title: 'Constituent Circle - AI-Powered Constituent Communication Platform',
  description: 'Transform constituent engagement with AI-powered communication tools. Streamline responses, analyze sentiment, and build stronger connections with your community.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://constituentcircle.com',
    site_name: 'Constituent Circle',
    images: [
      {
        url: 'https://constituentcircle.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Constituent Circle',
      },
    ],
  },
  twitter: {
    handle: '@ConstituentCircle',
    site: '@ConstituentCircle',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      property: 'dc:creator',
      content: 'Constituent Circle',
    },
    {
      name: 'application-name',
      content: 'Constituent Circle',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
};

export const generateSEO = (pageTitle?: string, pageDescription?: string) => ({
  ...defaultSEO,
  title: pageTitle ? `${pageTitle} | Constituent Circle` : defaultSEO.title,
  description: pageDescription || defaultSEO.description,
});
