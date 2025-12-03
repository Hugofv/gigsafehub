import React from 'react';
import { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: 'Page Not Found - GigSafeHub',
    description: 'The page you are looking for could not be found. Explore our insurance products, guides, and comparisons for gig economy workers.',
    robots: {
      index: false, // Don't index 404 pages
      follow: true,
    },
    openGraph: {
      title: 'Page Not Found - GigSafeHub',
      description: 'The page you are looking for could not be found.',
      type: 'website',
      url: `${baseUrl}/404`,
      siteName: 'GigSafeHub',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          alt: 'GigSafeHub Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Page Not Found - GigSafeHub',
      description: 'The page you are looking for could not be found.',
      images: [`${baseUrl}/logo.png`],
    },
  };
}

export default function NotFound() {
  return <NotFoundClient />;
}
