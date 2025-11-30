import React from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/services/mockDb';
import { getLatestArticles } from '@/services/api';
import HomeClient from './HomeClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'GigSafeHub - Seguros e Proteção para Trabalhadores da Economia Gig'
    : 'GigSafeHub - Insurance and Protection for Gig Economy Workers';
  const description = locale === 'pt-BR'
    ? 'Compare seguros, encontre proteção financeira e descubra as melhores opções para motoristas, entregadores, freelancers e nômades digitais. Guias, comparações e recomendações especializadas.'
    : 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads. Guides, comparisons and specialized recommendations.';

  return {
    title,
    description,
    keywords: locale === 'pt-BR'
      ? ['seguro', 'gig economy', 'motoristas', 'entregadores', 'freelancers', 'seguro para uber', 'proteção financeira']
      : ['insurance', 'gig economy', 'rideshare insurance', 'delivery insurance', 'freelancer insurance', 'financial protection'],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}`,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          alt: 'GigSafeHub Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'pt-BR': `${baseUrl}/pt-BR`,
        'en-US': `${baseUrl}/en-US`,
      },
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
  };
}

async function Home({ params }: { params: { locale: string } }) {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.safetyScore > 95).slice(0, 3);

  // Fetch latest articles for carousel and blog section
  const latestArticles = await getLatestArticles(6, params.locale);
  const carouselArticles = latestArticles.slice(0, 3); // First 3 for carousel
  const blogArticles = latestArticles.slice(0, 6); // All 6 for blog list

  return (
    <HomeClient
      locale={params.locale}
      featuredProducts={featuredProducts}
      carouselArticles={carouselArticles}
      blogArticles={blogArticles}
    />
  );
}

// Enable static generation for better performance
export const revalidate = 3600; // Revalidate every hour

export default Home;
