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
  // Always use production base URL for canonical to ensure consistency
  const productionBaseUrl = 'https://gigsafehub.com';
  // Don't add suffix, template from root layout will add it
  const title = locale === 'pt-BR'
    ? 'GigSafeHub - Guias Especializados de Seguros para Trabalhadores da Gig Economy'
    : 'GigSafeHub - Specialized Insurance Guides for Gig Economy Workers';
  const description = locale === 'pt-BR'
    ? 'Aprenda como proteger sua renda, veículos e responsabilidade profissional. Guias especializados e artigos práticos criados por especialistas para motoristas de aplicativo, entregadores e freelancers. 100% gratuito e atualizado regularmente.'
    : 'Learn how to protect your income, vehicles, and professional liability. Specialized guides and practical articles created by experts for rideshare drivers, delivery workers, and freelancers. 100% free and regularly updated.';

  const keywords = locale === 'pt-BR'
    ? [
        'seguro para motoristas de aplicativo',
        'seguro uber',
        'seguro 99',
        'seguro para entregadores',
        'seguro para freelancers',
        'gig economy brasil',
        'proteção financeira',
        'guias de seguros',
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
        'insurance guides',
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
      url: `${productionBaseUrl}/${locale}`,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
      images: [
        {
          url: `${productionBaseUrl}/logo.png`,
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
      images: [`${productionBaseUrl}/logo.png`],
      creator: '@gigsafehub',
    },
    alternates: {
      canonical: `${productionBaseUrl}/${locale}`,
      languages: {
        'pt-BR': `${productionBaseUrl}/pt-BR`,
        'en-US': `${productionBaseUrl}/en-US`,
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
