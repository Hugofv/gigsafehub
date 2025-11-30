import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import StructuredData, { generateOrganizationStructuredData, generateWebSiteStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    default: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
    template: '%s - GigSafeHub',
  },
  description: 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads. Guides, comparisons and specialized recommendations.',
  keywords: ['insurance', 'gig economy', 'rideshare insurance', 'delivery insurance', 'freelancer insurance', 'financial protection'],
  authors: [{ name: 'GigSafeHub' }],
  creator: 'GigSafeHub',
  publisher: 'GigSafeHub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    siteName: 'GigSafeHub',
    title: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
    description: 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads.',
    images: [
      {
        url: '/logo.png',
        alt: 'GigSafeHub Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
    description: 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    // Add Google Search Console verification if available
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />

        {/* Preload critical fonts if using custom fonts */}
        {/* <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> */}
      </head>
      <body>
        {/* Structured Data for SEO */}
        <StructuredData data={generateOrganizationStructuredData()} />
        <StructuredData data={generateWebSiteStructuredData()} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
