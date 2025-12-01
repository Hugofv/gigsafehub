import React from 'react';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getProducts } from '@/services/mockDb';
import { getLatestArticles } from '@/services/api';
import StructuredData, { generateWebSiteStructuredData, generateOrganizationStructuredData } from '@/components/StructuredData';
import HomeClient from './HomeClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  noStore(); // Prevent metadata streaming - ensures metadata is in <head> on reload
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Don't add suffix, template from root layout will add it
  const title = locale === 'pt-BR'
    ? 'GigSafeHub - Seguros e Proteção para Trabalhadores da Economia Gig | Comparador de Seguros'
    : 'GigSafeHub - Insurance and Protection for Gig Economy Workers | Insurance Comparator';
  const description = locale === 'pt-BR'
    ? 'Compare seguros para motoristas de aplicativo, entregadores e freelancers. Encontre proteção financeira, compare apólices e descubra as melhores opções de seguro para trabalhadores da gig economy. Guias especializados, comparações imparciais e recomendações personalizadas.'
    : 'Compare insurance for rideshare drivers, delivery workers, and freelancers. Find financial protection, compare policies, and discover the best insurance options for gig economy workers. Specialized guides, unbiased comparisons, and personalized recommendations.';

  const keywords = locale === 'pt-BR'
    ? [
        'seguro para motoristas de aplicativo',
        'seguro uber',
        'seguro 99',
        'seguro para entregadores',
        'seguro para freelancers',
        'gig economy brasil',
        'proteção financeira',
        'comparador de seguros',
        'seguro responsabilidade civil',
        'seguro profissional',
        'seguro veículo',
        'economia gig',
        'trabalhadores autônomos',
        'seguro para nômades digitais',
      ]
    : [
        'rideshare insurance',
        'uber insurance',
        'lyft insurance',
        'delivery driver insurance',
        'freelancer insurance',
        'gig economy insurance',
        'financial protection',
        'insurance comparator',
        'general liability insurance',
        'professional liability insurance',
        'vehicle insurance',
        'gig worker protection',
        'independent contractor insurance',
        'digital nomad insurance',
      ];

  return {
    title, // Template from root layout will add suffix
    description,
    keywords,
    authors: [{ name: 'GigSafeHub' }],
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
          alt: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo.png`],
      creator: '@gigsafehub',
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
    other: {
      'application-name': 'GigSafeHub',
      'apple-mobile-web-app-title': 'GigSafeHub',
      'format-detection': 'telephone=no',
    },
  };
}

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.safetyScore > 95).slice(0, 3);

  // Fetch latest articles for carousel and blog section
  const latestArticles = await getLatestArticles(6, locale);
  const carouselArticles = latestArticles.slice(0, 3); // First 3 for carousel
  const blogArticles = latestArticles.slice(0, 6); // All 6 for blog list

  // Generate structured data
  const websiteData = generateWebSiteStructuredData();
  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      <StructuredData data={websiteData} />
      <StructuredData data={organizationData} />
      <HomeClient
        locale={locale}
        featuredProducts={featuredProducts}
        carouselArticles={carouselArticles}
        blogArticles={blogArticles}
      />
    </>
  );
}

// Force dynamic rendering to ensure metadata is always generated on reload
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate

export default Home;
